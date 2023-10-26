# CM Database

## Introduction

CM Database is a time-saving tool for church musicians who need to find appropriate music to perform at a particular church service. Users enter the keywords and/or Bible readings that relate to the service in question, and CM Database returns a musical suggestion.

CM Database is also a place where church musicians can log and track the music they have been performing, see what music is being performed at other churches, and add music of interest to a saved-music list.

Visit CM Database here: https://cm-database-a7b05e162636.herokuapp.com/

## Languages and Tools Used

- Python
- JavaScript
- Django Rest Framework
- React.js
- React Bootstrap
- PostgreSQL
- Heroku
- Figma

This was a solo project, undertaken over 10 days.

## Project Brief

This was the 4th and final project on the General Assembly Software Engineering immersive course. The brief was to build a full-stack CRUD app, using Django Rest Framework to build the back-end API, PostgreSQL to serve the database, and a React.js front end to consume the API. If possible, it should demonstrate some additional complex functionality, such as the integration of an additional 3rd-party API.

## Example User Experience

Imagine a new user called Tom Thompson. On registering, he is asked to provide the name of the church that he is affiliated with, in his case, St Thomas's, Fake Street. After logging in, he is directed to the new "homepage" for St Thomas's church. This page contains a list of Past Services that have taken place at St Thomas's, although, at first, that list will be empty. 

To add information about a recent service, Tom clicks the Add Service button. There, he provides information about the date of the service, what type of service it is (eg., a Sunday Mass, Wedding, etc.) and then, crucially, a list of music items performed at the service. For each music item, Tom is asked to provide a title, composer, a list of keywords, and a list of related Bible readings. This information is important because it is the main way in which CM Database gathers musical information for other users to search. In fact, this is why I decided to put the church homepage as the first page Tom is relocated to after login - by making it as easy as possible to add service information, I hope Tom remains motivated to do so.

Suppose that one of the music items that Tom added was called "In the Beginning", and that it's related reading was Genesis, Chapter 1. Imagine now another user, Joan Johnson of St Joan's Church, Unreal Street. Imagine that the vicar at Joan's church has selected a reading from Genesis Chapter 1 for an upcoming service. Now, instead of having to, say, read Genesis Chapter 1 for ideas, Joan can look up that chapter on CM Database, where she will be returned "In the Beginning". If Joan is interested in that item, she can save it to her saved-music list. 

Now suppose that Joan does end up performing "In the Beginning" and that, after doing so, she adds information about that service to the homepage of St Joan's. CM Database will recognise that this item already exists on the database, so instead of creating a new item, it will update the item with any new related keywords or readings that Joan might add.

Joan and Tom can also look up each other's churches using the church-search feature, allowing for them to get further inspiration from each other's musical selections.

## Planning

A plan was drawn up using [Figma](https://www.figma.com/file/33GgkYncYj5eaV3uzSikG7/CM-Database-with-design?type=design&node-id=0-1&mode=design&t=iAaQ5HHsqMszC2iH-0) for the wireframe and a text document outlining the "user story", React components, Django models, model relationships, and CRUD functionality.

Perhaps the main difference between the plan and the final app was that the user experience in the final app is slightly simpler than it was in the plan. Specifically, in the plan, users who enter either new or updated music-item information are required to submit another form for each item so that the database can be updated. In the final app, these updates are handled automatically.

## Key Features

### Updating music items

When a user enters information about a music item, the database needs to know:

1) Does that item already exist?
1) If it does already exist, has the current user entered any new keywords or related readings that need to be added to the database entry for this item?

To answer these questions and respond accordingly, I used Django's [get_or_create()](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#get-or-create) method, which looks for a particular item on the database and creates one if it doesn't exist. For a music item to qualify as a _new_ database entry, the "title" and "composers" fields must satisfy the [unique_together](https://docs.djangoproject.com/en/4.2/ref/models/options/#unique-together) constraint. Instead of setting this as an explicit constraint on the MusicItem model itself, I made this a "proxy" constraint by passing in the "title" and "composer" as keyword arguments to the get_or_create() method, so that the method knew to look only for items that satisfied this constraint.

Once the music item has been retrieved or created, the user's provided keywords and related readings are then sent to separate custom functions: "update_or_create_keywords()" and "update_or_create_related_readings()" respectively. In the update_or_create_keywords() function, each keyword entered by the user is sent as as a kwarg to another get_or_create() method, retrieving any keywords that already exist and appending any new ones. 

The same logic applies in the update_or_create_related_readings() function, but, in addition this function calls another custom function which retrieves the actual text of the reading from a 3rd-party API.

```
def fetch_reading_text(book, chapter, start_verse, end_verse):
   api_text = requests.get(f"http://bible-api.com/{book} {chapter}:{start_verse}-{end_verse}")
   text = api_text.json().get('text')
   return text

def update_or_create_keywords(instance, keywords_data):
    for keyword_data in keywords_data:
        keyword, _ = Keyword.objects.get_or_create(**keyword_data)
        instance.keywords.add(keyword)

def update_or_create_related_readings(instance, readings_data):
    for reading_data in readings_data:
        reading_data['text'] = fetch_reading_text(
            reading_data['book'], 
            reading_data['chapter'],
            reading_data['start_verse'], 
            reading_data['end_verse']
        )
        related_reading, _ = RelatedReading.objects.get_or_create(**reading_data)
        instance.related_readings.add(related_reading)

class MusicItemSerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True)
    related_readings = RelatedReadingSerializer(many=True)
    class Meta:
        model = MusicItem
        fields = ('id', 'title', 'composer', 'keywords', 'related_readings')

    def create(self, validated_data):
        keywords_data = validated_data.pop('keywords', [])
        related_readings_data = validated_data.pop('related_readings', [])

        music_item, _ = MusicItem.objects.get_or_create(
            title=validated_data['title'],
            composer=validated_data['composer']
        )

        update_or_create_keywords(music_item, keywords_data)
        update_or_create_related_readings(music_item, related_readings_data)

        return music_item
```

### Music Search

Users can search for music by keyword and/or Bible reading. Let's call items with only a keyword match or a reading match "weak matches", and items that match both the queried keyword and the queried reading "strong matches". Obviously, we want the strong matches to feature higher in the search results. The logic for this is provided by the "rankResults()" function in the MusicSearch component. This function uses RegExp to search for a match between the searched keywords or searched readings and any keyword or reading in the database. It uses the reduce() method to count the number of matches found and tally up the matches into a variable "score", before sorting returned matches in descending order by score.

```
function rankResults(keyword, book, chapter) {
    const results = [...allMusic]
      .map(item => {
        let score = 0

        if (keyword) {
          const keywordRegex = new RegExp(keyword, 'gi')
          const keywordScore = (item.keywords || []).reduce((acc, k) => {
            const match = k.keyword.match(keywordRegex)
            return acc + (match ? match.length : 0)
          }, 0)
          score += keywordScore
        }

        if (book) {
          const bookRegex = new RegExp(book, 'gi')
          const readingScore = (item.related_readings || []).reduce((acc, reading) => {
            const bookMatch = reading.book.match(bookRegex)
            const chapterMatch = chapter ? reading.chapter === parseInt(chapter) : true
            return acc + (bookMatch && chapterMatch ? 1 : 0)
          }, 0)
          score += readingScore
        }

        return {
          ...item,
          score,
        }
      })
      .filter(item => item.score)

    const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values())
    if (Array.isArray(uniqueResults)) {
      return uniqueResults.sort((a, b) => b.score - a.score)
    } else {
      return []
    }
  }
```

### Dynamic Form Fields

To add or update information about a service to the church homepage, users need to fill in all fields on the service form, but we do not know in advance how many music items will be listed, nor do we know, given any music item, how many keywords or related readings will be connected to it. To handle this, users have the option of creating or removing additional form fields for music items, keywords, and related readings. This is achieved in the ChurchPage component. For instance, for music items, there is an addMusicItem() function as well as a removeMusicItem() function which will either "push" (to add) or "splice" (to remove) a selected item from the service list before resetting the state of the service in question.

```
const addMusicItem = () => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems.push({
      title: '',
      composer: '',
      keywords: [],
      related_readings: [
        {
          book: '',
          chapter: '',
          start_verse: '',
          end_verse: '',
        }
      ],
    })
    setNewService({ ...newService, music_items: updatedMusicItems })

    const removeMusicItem = (index) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems.splice(index, 1)
    setNewService({ ...newService, music_items: updatedMusicItems })
  }
```
## Challenges / Bugs / Areas to Improve

### Nested Data Sets

In my experience, the most challenging aspect of this project was learning how to handle a data set with several nested layers. For instance, each service contains at least one music item, which contains at least one related reading, which contains a text which is pulled from a 3rd-party API. This created difficulties in both and back and the front end. 

In the back end, it took several attempts to figure out _where_ in my code these different data points should be handled. In an earlier version, the ServiceSerializer processed not just the service layer of information, but the music item layer as well, but this resulted in code which was hard to read and keep track of. It was only later that I separated out the concerns with a more actively-involved MusicItemSerializer.

Meanwhile, on the front end, the corresponding ChurchPage component is both confusing to read (because of its size) and also renders a page that, because of its high number of form fields, is still not particularly user-friendly. 

To improve the user experience of this page:

1) The styling could be altered so that form fields share a single line
1) Form fields could be displayed in a modal, so that users do not need to scroll the to the top of the page whenever they want to update a service
1) The various form fields required for related readings could be collapsed into a single field which uses RegExp to extract information (book, chapter, start verse, end verse)

### Update Service Button

Currently, the Update Service feature has a couple of flaws. Firstly, it only prepopulates the form fields with current information if the user has not exited that page since adding the service for the first time. As a result, users are required to reenter a lot of information again to make even a small update. 

Another flaw is that, suppose a music item has a related reading of Genesis, Chapter 1, Verses 1-3. If another user updates the readings of this item to include Genesis, Chapter 1, Verse 1-2, then this will create a new related reading, which seems wasteful. This could be rectified by adding some additional logic to the update_or_create_related_readings() function.

### Music Search

Currently, even though the rankResults() function can handle multiple keywords and multiple related readings, the SearchMusic component only allows for a single keyword and a single reading to be searched. This could be rectified with a dynamic form field of the sort used in the ChurchPage component.

### Save Music Item Button

Currently, the Save Music Item Button does nothing to let the user know that their request has been received. This could be fixed by redirecting the user back to the music search page after clicking it.

### Seeding

Ideally, this database will gradually be populated with useful information provided by users as they log the music that they are performing at their respective churches. If 100 churches added two music items every week, then, within a year, you could have as many as 1000 music items entered. However, in its early days, the database relies on being well seeded in order to be of any use as a search tool. The problem is that seeding the database with good musical suggestions is challenging and time-consuming because we don't have CM Database to help us! Finding a music item that truly fits well with a reading or a theme requires specialist knowledge, so, even though tools such as ChatGPT can quickly generate dummy data, that dummy data is unlikely to be of any real use to a musician. Although this is not ideal, I would hope that the fact users can use CM Database to log their musical performances would be enough to entice them to keeping adding to it, such that the database can grow to a useful size in the shortest time possible.



