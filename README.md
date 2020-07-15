# VOYAGER
## FYP Fall 2019

The “Voyager” is a comparative platform based mobile application which helps people to find the best possible means of transport between two locations, among both short and long distances. The user is enabled to assess between a variety of options and then choose as per his/her criteria, whether its focused-on cost variation or any other basis like duration of the trip.

### To build and run app ###

#### FOR WEB APPLICATION ####
To work with Angular & Ionic we need following set of tools to be installed in your machine.

1. VS Code for IDE.

2. Install Node.js to run Web application

3. To install all the Dependecies and imported libraries command below
    npm i

4. To install ionic components run below command
    npm install -g ionic

5. To Run web application, run command below 
    ionic serve

#### FOR MOBILE APPLICATION ####
To work with Ionic we need following set of tools to be installed in your machine.

1. Android SDK (https://developer.android.com/studio/)
2. js (https://nodejs.org ) Once android studio is downloaded please install it with admin permission.

Environment Path Setup: Please follow the below steps to setup up the JAVA environment path

1. Go to the following location, C: -> Program Files -> Java folder -> JDK -> Bin and copy the folder path from windows explorer. Example: — C:\Program Files\Java\jdk1.8.0_152\bin
2. Now, go to control panel -> System and Security -> System ->Advanced System Securities (it will be displayed in left side). You will be prompted with a popup window and Environment Variables button will be there in the bottom of the popup under the Advanced
3. Now you will get another popup with list of system environment variables and click NEW button to setup environment path for JAVA.
4. Now you can give a variable name as JAVA then the variable value is your JDK path (which you have copied in the step 1) and click OK.
5. Now we have successfully setup the android setup in our machine.

Setup Ionic package

  1. Open your node.js comment prompt and install IONIC Plugins by using the below command
      npm install -g cordova ionic  //Once required node packages are downloaded for ionic we are set to go to create ionic app.

  2. Build IONIC by using command below ionic cordova platform add android
      ionic cordova build android

This Command will build an .apk file which can be installed on any android smartphone

  3. To run application on Emulator
      ionic cordova run android

### Account Login ###

Traveller Account: email: demo@yahoo.com pw: 12345678

Vendor Account: email: mjariali@gmail.com pw: 12345678

Admin Account: email: admin@voyage.com pw: admin123!@#
