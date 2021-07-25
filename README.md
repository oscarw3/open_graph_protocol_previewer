
# Oscar's Open Graph Protocol Previewer
Allows users to test and preview an Open Graph Image from any url

## Setup
Make sure the following are installed:
Postgres, Rails 6.0, Ruby 2.6, Webpacker

In addition, we will want to install webpacker angular with the following:
`rails webpacker:install:angular`

**Yarn and bundle install:**
```
yarn install --check-files
bundle install
```

It’s been a while since I’ve developed in Rails. I didn’t include all the basic installation steps (ie. installing rails), so if I’m missing such an installation step that I shouldn’t have assumed has already been installed please let me know!

**Set up db (postgres db):**
```
Rake db:create
Rake db:migrate
```
  
**Run the app:**
`Bundle exec foreman start -f Procfile.dev`
Go to [http://localhost:5000/](http://localhost:5000/)
Insert a url into the text field and press the button to get the image!

# Implementation Approach
At a high level, my implementation design uses a Rails RPC API backend with an Angular 2 Frontend, a Postgres database, and the processing updates were sent via websockets. I chose to use an RPC API because the functions don’t fit into a typical CRUD framework. I chose to use Angular 2 since that’s what I last used and am most comfortable with. Since the meat of this project was meant to be asynchronous, I was deciding between using Websockets and Polling. Given the support in Rails with ActionCable, I thought it made sense to explore ActionCable and to provide actual real time updates with websockets. The tradeoff is, if this was a real production application, I would have to worry about recovering if the connection was terminated, which I ignored for this exercise.

I chose to create a channel for each url that hit the application. When the url is processed, it would update all clients connected to the channel for that url. This way, if there are multiple web pages submitting the same url, it will not need to re-execute the request.

I used a thread instead of an ActiveJob, since it was simpler. A job would potentially make it easier to retry the process and just make it more robust in general.

I also kept the model fairly simple. Since I used websockets, the metadata didn’t necessarily have to be stored (it could just be returned after parsing), so I’m mostly using the db as a caching layer. I’m storing the processing status, the url, image_url, and a list of processing errors (ie. if the website isn’t open graph protocol compliant) which I can display on the site.

### Basic QA testing 

I tested these websites with these results:

-   [https://www.facebook.com/](https://www.facebook.com/) => error, website is not open graph protocol compliant
    
-   [http://localhost:5000/](http://localhost:5000/) => error, website is not open graph protocol compliant
    
-   “Test 1213” => error, The url passed in is invalid
    
-   [https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ) => rick roll thumbnail
    
-   [http://www.test123.com](http://www.test123.com) => error, unable to connect to website, Failed to open TCP connection to www.test123.com:80 (getaddrinfo: nodename nor servname provided, or not known)
    
-   [http://theringer.com](http://theringer.com) => error, request to website failed
    
-   [https://www.nba.com](https://www.nba.com) => nba thumbnail
    
I also tested opening two browser tabs with the same graph compliant website with a short lag (added sleep to make the difference more apparent), which showed the images at the same time despite the lag (verifying that it is only running once for the same url).
    

 ## If productionized
Things to clean up if we wanted to productionize this:

-   More validation, I only added super basic validation of the url, ie. trimming empty spaces/slashes after the url, checking character length of the url… etc.
    
-   I used a thread, but could probably use an ActiveJob in production. This could help for Fallback/Retry logic in case it fails, just make the workflow more robust. Another use case of ActiveJob: currently, if it’s stuck in progress (the thread fails for some reason), the status will never update. We could use ActiveJob to make it fail more gracefully if I didn’t rescue the error.
    
-   I tried to rescue some of the common errors to display, but only tested it for some urls, so it’s possible that other urls might trigger other errors that weren’t rescued.
    
-   I should move the scss to component.scss as is intended with angular 2.
    
-   Add better logging/error handling if the channel did not subscribe to the websocket correctly for some reason (it currently just logs an error).
    
-   There is more configuration set up to get this production ready depending on how we want to get this ready for production, I only tested this locally.
    
-   Make it mobile friendly, clean up the UI. (Obviously the design could use a bit of work!).
    
-   Since we’re treating the db as a cache, we could have the db expire the url if it’s been a while, like redis.
    
-   Some of the errors I’m displaying are directly from the client to help me with debugging/readability since this is an exercise, but my goal was just to surface the issue. In prod I would probably display the user specific error, and log the engineering related errors.
    
-   Add ruby tests, e2e tests, typescript unit tests. I added one test just for the sake of having a test, but if this was productionized code I would definitely add tests for the backend code in ruby, add e2e tests and typescript unit tests as well :).
