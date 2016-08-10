# Paritosh Introduction

# Introduction

1. VD
Show the VD and point out the various flows in a typical hotel booking
application.

https://projects.invisionapp.com/share/BZ75ZOMU7#/screens/145334587

2. Application Walk-Through
We've made a simple hotel booking application to demo the numerous advantages
of component driven development. The demo application only has a subset of
the features that you see in the VD but the purpose of this application is to
highlight the component driven development.

Do a walk through of the demo.
https://travelnxtelements.github.io/hotel-demo/

Save confirmation page.

3. What is component driven development?
We don't use pages to break down applications but use a new vocabulary for
making reusable components. The strategy is not new ASP.NET widgets, Ember
components etc. have existed but are inherently limited by the underlying
platform, the browser. But, now the components are written in the html5
standard and being actively implemented in the browsers. Which means
more __reuse__ of the components you make. We make all of our component using
polymer, which is a library and only provides the very fundamental features
to speed up the component driven development. Now let's see what parts of our
application will components.

4. Component: t-header
Each page consists of a header with some variations and since a component is
another name for __reuse__ we make a component for it. But how do handle all
the variations?. A component exposes certain endpoints through which you can
manipulate the behavior of a component. The endpoints are simple HTML attributes
like `style`, `class`, `hidden` etc. Web components and custom tags are two
different names for the new abstraction mechanisms provided by the browser.
A component is basically some HTML, CSS, JS thrown together to make a new
HTML tag. So to basically to modify the behavior of a component you change
an attribute.

5. Docs: t-header
So, we've made a playground-cum-documentation website where you can change the
attributes on a component and see how that changes the component markup and
component behavior. So let's head over to the page of t-header on this site
so that we can change the component.

Show various combinations of t-header properties.

Save this documentation page.
http://atom-project.io/elements/header/

# Code

6. How to make components for an application?.
The basic philophy is __reuse__ so make components so that they can be reused
as often. So we make one component that only has shows something, we make another
which makes a mystique api call, we have another that translates the api
responses etc. This ensures that in case of api change you can reuse the view
components and vice versa.

View source and explain components on the search page.

7. HTML, Open Source, Simple and Flexible
The code consists of pages containing components and some javascript for gluing
all the components together. Show what pure HTML means by making a JSFiddle demo
for t-header. Also, show the structure of a component.

Show the code on github.
https://github.com/travelnxtElements/hotel-demo

Show the t-header jsfiddle demo. Crate the header on search page.
https://jsfiddle.net/

Show the code structure of `hotel-itinerary`
https://github.com/travelnxtElements/hotel-demo/blob/master/components/hotel-itinerary.html

8. Making changes

Show t-faredetails components' `isCollapsible` property using attribute and console.

9. gh-pages & load-more
gh-pages is the mechanism with which you can host static html pages in your
git repositories on github. It's free. Just make a branch called `gh-pages`
in a repo hosted on github. Put html files and you're done. That's what we've done.
So let's edit some code.

add load-more option to t-list

10. Element repeating t-list

Change `hotel-result-item` to `hotel-itinerary` in the code

11. Theming
There is a new standard in css3 which introduces scoped styles and variables
in css. Theming is done using this features for which polymer provides a polyfill.

Show basic theming features

Change the branding logo
http://tnc.travelnxt.com/

Change the primary color using
http://tnc.travelnxt.com/
