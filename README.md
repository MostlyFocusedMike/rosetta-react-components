# Same thing different Components
In this little repo We're just looking at a simple button clicker using both class and hook based components.
Just clone, install and run. Be sure to study the files for differences, becuase as you can see, to the end user,
the appear identical.

## A tale of two comparisons
With classes we can use shouldComponentUpdate to block useless rerenders, with functional components, you need to use the React.memo higher order component. However,

## Regular js comparisons
We all know that two identical looking objects point to differnt locations in memory, so they actually fail equality checks:

```js
{a: 'a'} === {a: 'a'}
// FALSE
```

So then why does our shouldComponentUpdate function allow this?

```js
// ...GrandParent
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
class Parent extends Component {
    shouldComponentUpdate(prevProps, prevState) {
        if (prevProps.handleClick === this.props.handleClick) { // ??? WHY IS THIS TRUE?!
            return false
        }
    }
// ...rest of component
```

 However, something interesting happens. In React.memo, when comparing old vs new, you may need to add a special comparison function,