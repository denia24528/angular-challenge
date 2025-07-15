# time:matters Angular Challenge

## Introduction
This is a our short coding challenge in Angular to get some more insights about your coding skills. The given task should be handleable within 1-2 hours. 

> Our focus: We're looking for code that is **clean**, **readable** and **maintainable**. 

If you have any questions feel free to contact us via joachim.roppert@time-matters.com.

# The task

Fork that repository, create an *Angular based* project, preferably with Angular Material components, and implement a little application. We want to access aircraft data of an API (see link at the end) and show that in a nice way in the browser.
You can search with it either for aircrafts by their registration code and get some details about the plane itself or search by their callsigns to get more information about their routing.

### Requirements
* A form with two elements
  * A switch (e.g. a radio box) to define the search type (aircraft/callsign)
  * An input field to enter 1-n values (there should be a way to search multiple values at once)
* Some (basic) error handling for non-existing values (or other responses from the API)
* Visual representation of the results in a way you think it makes sense, be creative!

You find more about the (free and not limited) API in here:
https://www.adsbdb.com/

We don't care (in that challenge) about perfect designs, mobile optimization or handling every single error response/user input.
We care more about your code and the way you work(ed) on that task.

Don't get lost by moving the visuals in a perfect way with perfect colors.

Focus on the core.
And enjoy!


## How to Run the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   nx serve aircraft-search
   ```
   The app will be available at [http://localhost:4200](http://localhost:4200).

---

## Example Searches

- **Aircraft by registration code:**  
  Enter `N8732S` or multiple codes separated by commas or spaces, e.g. `N8732S,D-EEZX` or `N8732S D-EEZX`. Or you can use any number <1000 e.g. `99,250,388` or `99 250 388`
- **Callsign search:**  
  Switch to "Callsign" and enter a callsign like `DLH123` or multiple callsigns, e.g. `DLH123,BAW456` or `DLH123 BAW456`.

---

## What Was Done & How It Works

- The project uses Nx monorepo structure with Angular 20 and Angular Material for UI components.
- The main app (`aircraft-search`) is modular and leverages standalone components and lazy-loaded features.
- The search form allows users to select between searching for aircraft by registration code or by callsign. Multiple values can be entered at once, separated by commas.
- When a search is submitted, the app splits the input and sends parallel requests to the ADSBdb API for each value.
- Results are displayed using Material cards, showing relevant details for each aircraft or flight route.
- Basic error handling is implemented: if a value does not exist or the API returns an error, a clear message is shown to the user.