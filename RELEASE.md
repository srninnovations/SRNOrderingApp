#Step 1
merge all changes to main

#Step 2
merge main into release-version branch

#Step 3
on release-version branch - change version numbers (increase both versionCode and versionName by 1)
file: android > app > build.gradle
versionCode 2
versionName "1.0.1"

#Step 4
from the android directory run:
./gradlew bundleRelease

the generate file will be in:
android > app > build > outputs > bundle > release

#Step 5
visit: https://play.google.com/console/u/0/developers/?pli=1
login

    select app
        navigate to release production
            click create new release
                upload bundle file
                    add release notes
