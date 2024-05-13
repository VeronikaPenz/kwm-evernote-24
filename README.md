<h1><img src="http://evernote.s1810456025.student.kwmhgb.at/assets/evernote.png" width="30"> KWM-Evernote</h1>
<p>s1810456025 / Veronika Penz / KWM SS24</p>
<p><strong>Frontend: </strong><a href="http://evernote.s1810456025.student.kwmhgb.at/">evernote.s1810456025.student.kwmhgb.at</a></p>
<p>Test users:</p>
<ul>
  <li>veronika@kwm.at | Password12!</li>
  <li>simon@kwm.at | Simon12!</li>
  <li>sabrina@kwm.at | Sabrina12!</li>
  <li>marvin@kwm.at | Marvin12!</li>
  <li>lukas@kwm.at | Lukas12!</li>
  <li>nina@kwm.at | Nina12!</li>
  <li>theresa@kwm.at | Theresa12!</li>
</ul>

## Preamble
I didn't use any AI tools for creating the code, the logo was created using an AI-generator. Some snippets (mostly for the BE) were copied from the bookstore lesson project. All other code was written by me. I am unsure as to the desired scope of this project-documentation, as such i tried to cover the broad strokes as well as some particularities to the best of my abilites. I hope the result will satisfy, I will glady elaborate additional details before or during the exam/presentation should anything in particular be unclear.

## Workflow
<ol>
  <li><strong>BE-Setup:</strong> I first started by creating a database model based on the assignment. After that was completed I created the backend models, controllers and associated CRUD API-endpoints. APIs were initially tested using postman.</li>
  <li><strong>Auth:</strong> The next step was to create an authentication controller and to secure all previously created routes.</li>
  <li><strong>FE-setup: </strong>After the creation of the backend I set up the angular frontend and created some basic layout components.</li>
  <li><strong>FE-listing: </strong>All frontend listing-functionalities.</li>
  <li><strong>FE-edit: </strong>All frontend edit-functionalities.</li>
  <li><strong>FE-create: </strong>All frontend create-functionalities.</li>
  <li><strong>Share & Tag filtering: </strong>The last functionalities I implemented were share & filtering. Throughout the creation of the frontend-functionalities I sometimes had to adjust some of the REST Controllers or add new routes.</li>
</ol>

## File structure
The angular frontend's source-files are contained within the resources directory of the laravel installation. All laravel web routes defer to an angular.blade view which serves as the mount-point for the angular application (the FE-build is contained in public/assets/angular). <a href="https://medium.com/swlh/how-to-setup-laravel-with-angular-d3de171afa03">This article</a> served as the guide for this setup.
<p><img src="http://evernote.s1810456025.student.kwmhgb.at/assets/evernote-files.png" width="300"></p>

## Database Design
I didn't create a full ERD with all attributes listed, because I didn't deem it necessary (The individual table columns stick very close to the minimum requirements listed in the assignment). The ERD below was used to model the database relationships.
<p><img src="http://evernote.s1810456025.student.kwmhgb.at/assets/evernote-erd.png" width="524"></p>
A User has multiple Items they can create; Lists, Notes, Tags and Todos, all of which have a foreign key to Users indicating the owner. Tags can be used for both Notes and Todos represented by n:m relationships. Lists and Users share an additional n:m relationship, represented by Shares. A User can either be connected to a given List via Share or by being its owner. Shares can also be referenced by a foreign-key in Todos, representing a Todo within a shared list that is assigned to a User.
<br><br>
Because my DB-model resulted in some circular references, my migrations are split into two parts; first creating all tables, then applying foreign keys, this way I don't run into conflicts when rolling back the migrations. I also created seeders with lots of demo-data for all tables, to enable proper testing (this could have been generated, but i wanted data that approximates real data).

## External libraries
The backend used the same libraries as the ones used in the lessons. The frontend uses the following libraries to add styles and interactive elements:
<ul>
  <li><a href="https://primeng.org/">primeng</a>: basic UI-component library, chosen due to prior experience with it.</li>
  <li><a href="https://primeng.org/icons">primeIcons</a>: addon to primeng for icons, chosen due to prior experience with it.</li>
  <li><a href="https://primeflex.org/">primeFlex</a>: class-library for layouting (although I think I didn't actually end up using any of it).</li>
</ul>

## Functional scope
the following features have been fully implemented (frontend & backend):
<ul>
  <li>Login using email & password</li>
  <li>Logout as well as automatic logout on token-expiration</li>
  <li>Todos: list / create / edit / delete / check / filter by tag</li>
  <li>Notes: list / create / edit / delete / check / filter by tag</li>
  <li>Lists: list / create / edit / delete / check / filter by tag</li>
  <li>Share Lists with other users</li>
  <li>Accept other users' shared lists and view them</li>
  <li>view todos assigned to self & check them</li>
  <li>Tags: tags don't have their own route or listing, instead they are added to todos and notes when creating or editing those items (either existing or new). Tags are automatically deleted when no todo or note uses them.</li>
  </li>
</ul>
the following features were planned for implementation but didn't make it due to time constraints:
<ul>
  <li>Register new user & edit account information (the REST endpoints for these exist)</li>
  <li>Add existing "unlisted" Todos to Notes (todos can only be added to notes by creating them within them)</li>
  <li>Add existing "unlisted" Notes to Lists (notes can only be added to lists by creating them within them)</li>
  <li>Assign todo to user</li>
</ul>

## Frontend routes
The following list represents the page-tree of the frontend-applications (login only links to home, all other pages can link to any other page via the central nav-bar):
<ul>
    <li>login</li>
    <li>home
        <ul>
            <li>lists</li>
            <li>notes</li>
            <li>todos</li>
            <li>shared</li>
            <li>assigned</li>
        </ul>
    </li>
</ul>

For all listing routes: I opted against the use of /detail routes, because i didn't deem it necessary given the limited amount of information any 1 item contains. All edit and create functionalities are contained within modal dialogs.
<ul>
  <li><strong>login</strong> -> this route contains the user login. (Originally the plan was to add an option to create a new account, but I ended up not implementing this feature.)</li>
  <li><strong>home</strong> -> this route simply shows which user is currently logged in.</li>
  <li><strong>lists</strong> -> this route shows all of a user's lists. The user can add new lists as well as edit and delete existing ones. The lists can also be filtered by tag. Within each list, notes and their todos can be created, edited and deleted. Lists can also be shared with other users.</li>
  <li><strong>notes</strong> -> this route shows all of a user's notes that are not contained in lists. The user can add new notes as well as edit and delete existing ones. The notes can also be filtered by tag. Within each note, todos can be created, edited and deleted.</li>
  <li><strong>todos</strong> -> this route shows all of a user's todos that are not contained in notes. The user can add new todos as well as edit and delete existing ones. The todos can also be filtered by tag.</li>
  <li><strong>shared</strong> -> this route shows all lists that have been shared with the current user. Lists can have two statuses; pending and accepted, a user has to accept a pending list in order to view its contents. As these lists do not belong to the current user, they can only be viewed, not edited or deleted. Todos assigned to the current user contained within notes within the lists can be checked, changing their status.</li>
  <li><strong>assigned</strong> -> this route shows all todos contained within shared lists that have been assigned to the current user. As these todos do not belong to the current user, they can only be viewed and checked, not edited or deleted.</li>
</ul>

## API services & Backend implementation
On the backend side I mostly stuck to the concepts introduced throughout the lessons (the full list of endpoints can of course be found in routes/api.php, as such they will not be listed here). Some noteworthy points:
<ol>
  <li>grouping APIs by namespace -> i found this to be rather useful in keeping the grouwing api-file orderly + it helped with the implementation of the Owner.php middleware.</li>
  <li>Owner.php middleware -> I used the same jwt-token logic presented in the lecture for authentication. I wanted to make sure a user can only view and alter items they have access to, either by being the owner or by having them shared. For this i created an Owner middleware, which validates these access rights. Initially I considered creating multiple middlewares for each API namespace (Note/Todo/List/etc.) individually, but during implementation it turned out the check is nigh identical most of the time regardless of namespace and object-type. As such i decided on making it a singular middleware which adjusts to the namespace of the respective request coming in.</li>
  <li>I use get-parameters in some requests to apply filters for tags and shared -> e.g. /lists/user/{userId} returns an array of lists belonging to a given user, this API has 2 get modifiers; "?sharedWith=1" which instead returns 2 arrays for lists shared with the user (pending & accepted) & "?filter=<tagId>" which makes the result filterable by tag.</li>
  <li>simple images -> I opted against the use of an explicit images table (like in the lesson), instead using simple strings, because I didn't deem it necessary given the limited role images play in my application.</li>
</ol>
<p>All endpoints that are used to fetch items based on userId could theoretically also have been implemented by using the id of the logged-in user. As there is currently no use-case within the frontend where a user fetches the items of another user. However theoretically, if the application were to be expanded, one could add a feature whereby a user can check another's profile and see their lists. As such I decided against this approach.</p>

## Frontend implementation notes
Some noteworthy points:
<ol>
  <li>api.service -> The angular data services all use a centralized api.service, which can issue asynchronous requests to the server using fetch(), returning a promise. I find this implementation more legible and straightforward than the observer-approach presented in the lecture (+ I did not deem it necessary to create observers for all data streams, as most are only issued once), thus i opted to deviate from the implementation presented in the lecture and used my own.</li>
  <li>models & factories -> In the lecture these 2 were split into two seperate files, i decided to merge these.</li>
  <li>dynamic-form -> I created a dynamic form-builder component which renders out angular formGroups based on a configuration input. This greatly reduces code redundancy and makes the application more scalable.</li>
  <li>modal dialogs -> all edit and create operations are handled using modal dialogs, this eliminates the need for more routes and makes the application more scalable.</li>
  <li>uniform display and function -> todos look and behave exactly the same, regardless of whether they are listed alone, or part of a note or list. all features (edit/delete/check) can be used regardless of context. This is true for all other items as well. (in general i tried to limit code redundancy to a minimum; all tag filters use the same component, all create dialogs use the same components, etc.</li>
</ol>
