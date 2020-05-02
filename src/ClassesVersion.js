import React, { Component, Children } from 'react';

class GrandParent extends Component {
    state = {
        status: 'on'
    }

    handleClick = (e) => {
        console.log('i was clicked: ');
        this.setState((prevState) => ({ status: prevState.status === 'on' ? 'off' : 'on'}))
    }

    render() {
        const { status } = this.state
        return (
            <div>
                <h1>{status}</h1>
                <Parent status={status} handleClick={this.handleClick}/>
            </div>
        )
    }
}

class Parent extends Component {
    shouldComponentUpdate(prevProps, prevState) {
        // Without the check, this component will rerender because GrandParent rerenders
        // even though nothing in this component actually updates. In real life, you would
        // likely run a comparison, but for this simple app, we can shut off renders
        // but try changing the return value to true to see that it rerenders

        // return true;
        return false;
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

const Child = (props) => {
    const { handleClick } = props;
    return (
        <div>
            <button onClick={handleClick}>Toggle</button>
        </div>
    )
}

export default GrandParent;