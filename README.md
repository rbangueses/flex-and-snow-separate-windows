# Flex and Service Now on separate windows

This sample plugin shows another way of integrating Flex with an external solution such as Service Now. It basically screen-pops Service Now on different windows depending on the reason for the call / interaction. For example, if the call is about opening a new ticket, we open the new ticket window. If the interaction is about an existing ticket, we open the existing ticket. New use cases can be added.

Additionally, links to open other pages have been embedded on Flex, so as to automatically open the list of existing tickets or even an external CRM. Modify this plugin to fit your needs.

The time to deploy is minimal and no development is required on service now.

## Setup

Edit the SnowPlugin.tsx file in src folder, line 23 where it says: `et screenPopBaseURL = "https://dev69218.service-now.com";` make sure the url is for your own Service Now instance.

 
This plugin will require modification of the existing Studio flow so that tasks come with the following attributes:

`{"sntype":"new", "comment":"" }`

or 

`{"sntype":"existingIncident", "incident":"incident_number"}`


The `sntype` key-value pair identifies if the incoming interaction is about a new or existing incident.

The `comment` key-value pair is not necessary.

The `incident` key-value pair is for the incident number that the task is about, and will be used to screen-pop the right incident page.

A sample Studio flow can be found in the twilio-studio folder.

## Usage

It's recommended for agents to login to Service Now at the beginning of the day, as well as Flex. Once logged in, they can make the window smaller and position it at the left of the screen. The plugin will calculate the size of the Service Now window based on the Flex window as well as the screen size automatically.

It's possible to simplify this process by creating a separate web page that will automatically login on Service Now and always opens Flex in a smaller window positioned on the left, but this piece of work has not been carried out yet.


# Sample video - existing incident


https://user-images.githubusercontent.com/98812531/226387828-4e33de48-70bc-48f4-8c1d-bf94bc2e426e.mov


# Sample video - new incident


https://user-images.githubusercontent.com/98812531/226388110-7d2fa8e6-fbc1-4173-8211-a7938daa2a14.mov


# Sample video - smart window sizing


https://user-images.githubusercontent.com/98812531/226388394-a4b4eb97-883a-48de-af9e-18b92561b36c.mov


