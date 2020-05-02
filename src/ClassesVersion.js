import React, { Component } from 'react';

class GrandParent extends Component {
    constructor() {
        super();
        console.log('I was instantiated');

        this.state = {
            status: 'on'
        }
    }


    // do NOT forget to use the arrow functions in class based components
    handleClick = (e) => {
        console.log('i was clicked in a class');
        this.setState((prevState) => ({ status: prevState.status === 'on' ? 'off' : 'on'}))
    }

    render() {
        const { status } = this.state

        return (
            <div>
                <h1>Class Example</h1>
                <h2>{status}</h2>
                <Parent status={status} handleClick={this.handleClick}/>
            </div>
        )
    }
}

class Parent extends Component {
    shouldComponentUpdate(prevProps, prevState) {
        // Without the check, this component will rerender because GrandParent rerenders
        // even though nothing in this component actually updates. In real life, you would
        // likely run a comparison, but for this simple app, we can shut off renders.
        // but try changing the return value to true to see that it rerenders
        // Also note that no matter what, React renders this twice on the first load. That's just React being React
        // brownie points if you can explain that extra render

        // Hey wait! Why does this work? don't two functions fail an equality check? Check the readme
        if (prevProps.handleClick === this.props.handleClick) {
            return false
        }
        return true;
    }
    render() {
        console.log('I do nothing but pass props, do I really need to be re-rendered?');
        const { handleClick } = this.props;
        return (
            <div>
                <Child handleClick={handleClick}/>
            </div>
        )
    }
}

// This is a good old fashioned "dumb", "stateless", "presentational" functional component
// these were for components that didn't have state.
const Child = ({ handleClick }) => {
    return (
        <div>
            <button onClick={handleClick}>Class Version Toggle</button>
        </div>
    )
}

export default GrandParent;