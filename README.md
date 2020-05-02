# Same thing different Components
In this little repo We're just looking at a simple button clicker using both class and hook based components.
Just clone, install and run. Be sure to study the files for differences, becuase as you can see, to the end user,
the appear identical.

# Why does stuff run twice??
If you're using create-react-app, like this project, then you may notice logs appear doubled sometimes. That's because of React.strictMode, which is called in the index.js file:
https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects

TL;DR: React is trying to help you notice unwanted side effects. So in dev builds, it will run things like render and constructor methods *twice*. This would make unwanted side effects and memory leaks more obvious so you can catch them. That's why in this project a bunch of logs show up twice when they would really only show up once in production. You can turn it off if you don't like it by removing the tags, but it's probably a good idea to leave them in.

# A tale of two comparisons
Go read the files first! This extra!

With classes we can use `shouldComponentUpdate` to block useless rerenders, with functional components, you need to use the `React.memo` higher order component. However, I noticed some weirdness about this, and thought it might save you from some bugs

## Regular js comparisons
Two identical *looking* objects point to differnt locations in memory, so they actually fail equality checks:

```js
{a: 'a'} === {a: 'a'}
// FALSE
```

But then why does our `shouldComponentUpdate` function allow a comparison of two functions to be true?

```js
// ...Class GrandParent
    handleClick = (e) => {
        console.log('i was clicked in a class');
        this.setState((prevState) => ({ status: prevState.status === 'on' ? 'off' : 'on'}))
    }

    render() {
// ...render func
        return (
// ...more return
                <Parent status={status} handleClick={this.handleClick}/>
// ...rest of component
```
```js
class Parent extends Component {
    shouldComponentUpdate(prevProps, prevState) {
        // ??? WHY DOES THIS CHECK EVALUATE TO TRUE?!?!
        if (prevProps.handleClick === this.props.handleClick) {
        // ????
    }
```

That's...odd, especially since in `React.memo`, the *almost* exact same thing works like you'd think, where the same function is compared and found to be inequal:

```js
// ... functional GrandParent
    const handleClick = (e) => {
        setStatus((prevStatus) => prevStatus === 'on' ? 'off' : 'on');
    }
    return (
// ...
        <Parent handleClick={handleClick}/>
//...
```
```js
const propsAreEqualSoWeShouldNotReRender = (prevProps, nextProps) => {
    // this check will never evaluate to true
    if (prevProps.handleClick === nextProps.handleClick) {
//...
```

So, what is happening?

## The one way objects are equal
Objects fail equality becuase each new object points to a new location in memory. However, what if you could point to the *same* location? It's very simple to do: assign an object to a variable:

```js
const a = { a: 'a' };
a === a;
// TRUE
```

That's essentially what's happening with our class component. When the class is instantiated, we are defining a method `handleClick` on the class, and we're only ever doing it once. Meaning this:

```js
this.handleClick === this.handleClick
// TRUE
```

would evaluate to true.

And when we pass a value to props, we are passing that variable, `this.handleClick`. So, even though the `GrandParent` component rerenders and resends props down to the `Parent` component, it's always passing the same *variable* down.

This means that on the `Parent` component's `shouldComponentUpdate` method, the old value of `this.handleClick` points to the exact same location in memory as the new `this.handleClick`.

```js
class Parent extends Component {
    shouldComponentUpdate(prevProps, prevState) {
        // true because they're both pointing to the same thing:
        // prevProps.handleClick === GrandParent.handleClick
        // this.props.handleClick === GrandParent.handleClick
        if (prevProps.handleClick === this.props.handleClick) {
```

## Breaking it with anonymous functions
But, this could easily be undone. What if instead of this:

```jsx
<Parent handleClick={this.handleClick}/>
```

we did this?
```jsx
<Parent handleClick={() => { this.handleClick()}}/>
```

The end behavior of the code is identical, the app still works. However, we have broken our equality. By going from a named function to an anonymous one, we made a crucial change:

```js
const a = () => {}
a === a
// TRUE

// to this:
(() => {})  === (() => {})
// FALSE
```
Now that `shouldComponentUpdate` check will fail, becuase with each rerender we are passing in a brand new anonymous function (which is really just a fancy object), and each one points to a new location in memory.

## So what's the deal with the functional component?
Ok, so we understand the class, but why did the functional component with `React.memo` never work? Becuase unlike the class, which was created once, and called the render function unlimited times, a functional component is simply created fresh with every new render.

You can see this in action. Inside the class `GrandParent` component, I log to mark it's creation in the `constructor` method. As you can see, it is only ever instantiated on page load, the rerenders do not mean a new instance of the class gets created. That's becuase a class component simply calls it's `render` method on each new rerender. That means `this.handleClick` is only defined once for the lifetime of the component.

This is not the same for functional components. You can see that each time the functional `GrandParent` component rerenders, the log that marks it's creation gets run. That's becuase when a functional component is rerendered, the whole thing is just created anew. This means that it's `handleClick` function is a brand new version with every rerender. So, in the `React.memo` comparison, its *only* dealing with brand new methods that always point to a different spots in memory.

## In conclusion
React renders are tricky, but this little quirk was something we can easily explain because we understand how JS compares objects.