# CM Database

## Introduction

CM Database is a time-saving tool for church musicians who need to find appropriate music to perform at a particular church service. Users enter the keywords and/or Bible readings that relate to the service in question, and CM Database returns a musical suggestion.

CM Database is also a place where church musicians can log and track the music they have been performing, see what music is being performed at other churches, and add music of interest to a saved-music list.

Visit CM Database [here](https://cm-database-a7b05e162636.herokuapp.com/)

This was a solo project, originally undertaken over 10 days, but subsequently revised. The README for the old version can be found [here](https://github.com/AnthonyFort/cm-database#readme). This new README will repeat the Example User Experience section, but then focus on the differences between the two versions.

## Languages and Tools Used

- Python
- JavaScript
- Django Rest Framework
- React.js
- React Bootstrap
- PostgreSQL
- Heroku
- Figma

## Example User Experience

Imagine a new user called Tom Thompson. On registering, he is asked to provide the name of the church that he is affiliated with, in his case, St Thomas's, Fake Street. After logging in, he is directed to the new "homepage" for St Thomas's church. This page contains a list of Past Services that have taken place at St Thomas's, although, at first, that list will be empty. 

To add information about a recent service, Tom clicks the Add Service button. There, he provides information about the date of the service, what type of service it is (eg., a Sunday Mass, Wedding, etc.) and then, crucially, a list of music items performed at the service. For each music item, Tom is asked to provide a title, composer, a list of keywords, and a list of related Bible readings. This information is important because it is the main way in which CM Database gathers musical information for other users to search. In fact, this is why I decided to put the church homepage as the first page Tom is relocated to after login - by making it as easy as possible to add service information, I hope Tom remains motivated to do so.

Suppose that one of the music items that Tom added was called "In the Beginning", and that it's related reading was Genesis, Chapter 1. Imagine now another user, Joan Johnson of St Joan's Church, Unreal Street. Imagine that the vicar at Joan's church has selected a reading from Genesis Chapter 1 for an upcoming service. Now, instead of having to, say, read Genesis Chapter 1 for ideas, Joan can look up that chapter on CM Database, where she will be returned "In the Beginning". If Joan is interested in that item, she can save it to her saved-music list. 

Now suppose that Joan does end up performing "In the Beginning" and that, after doing so, she adds information about that service to the homepage of St Joan's. CM Database will recognise that this item already exists on the database, so instead of creating a new item, it will update the item with any new related keywords or readings that Joan might add.

Joan and Tom can also look up each other's churches using the church-search feature, allowing for them to get further inspiration from each other's musical selections.

## Improvements

### Adding and Updating Service Information

The form for adding and updated user service information have been redesigned to provide a more user-friendly experience. Firstly, it has been restyled to take up last space, making it easier to read. Then, when it comes to updating a service, the scrollTO() method is employed to take the user to the form automatically, so that they do not have to scroll back to the top of the page themselves. In addition, by clicking the update service button, the form will automatically be pre-populated with the current service information, so that users do not have to fill this out again.

### Music Search Page

Now, users have the option of adding multiple keywords and/or multiple readings to their search queries, where before they were limited to one keyword and one reading. As before, search results are ordered so that the results that most closely match the searches return higher in the list.

### Individual Music Item Information

Now, when an individual music item is viewed either after a search, or inside the saved music page, information about past performances of that item is now displayed. This information can be useful for church musicians as it gives them a better understanding of the context in which this music was performed, and an idea as to how popular it is with other musicians.

### Saving Music Items

Now, when a user saves a music item, they are notified and redirected to their saved music page.

## Issues Remaining

### Seeding Data

As mentioned before, the kind of information that CM Database is designed to provide is quite specialist, and so, until other users have used the app for a while as a way to keep a record of the music they have performed, the database does not contain rich data. 

To address this, I have begun a new project - [Service Scraper](https://github.com/AnthonyFort/Service-Scraper/blob/main/README.md) - which is intended to fetch useful musical information that other churches have published online, and use that data to seed CM Database.

### Filling Out Service Information

Although the user experience has surely been improved by redesigning the ChurchPage component, users are still required to type in a fair amount of information. Ideally, the Bible Books would be listed in a dropdown, but, unfortunately, Book titles are not fetchable from the 3rd-party API that I have used. A solution would be for me to manually add those options, or fetch them from another API, before making the call to a current one.

### Music Search Results Visibility

On the mobile version of the app, music search results appear quite low on the page, and it is possible that first-time users could miss them. Ultimately, the search page should be redesigned to return this information higher.

