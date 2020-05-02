import React, { memo, useState } from 'react';

const GrandParent = () => {
    console.log('Grandparent function was created');
    const [status, setStatus] = useState('on')

    const handleClick = (e) => {
        console.log('i was clicked in the function');
        // when we need the previous status to be 100% correct, setStatus can take a
        // function instead of an object. Whatever that function returns will become
        // the new status, and it takes in the previous state
        setStatus((prevStatus) => prevStatus === 'on' ? 'off' : 'on');
    }
    return (
        <div>
            <h1>Hooks Example</h1>
            <h2>{status}</h2>
            <Parent handleClick={handleClick}/>
        </div>
    )
}
// for function components, we need to use React.memo to stop rerenders
// do not confuse memo with useMemo. memo is a function that takes a pure component
// and shallowly compares its prevProps to nextProps. If no changes, then no updates.

// however, shallow means that function === function will never return true (identical looking are never equal)
// so that's why we need to use second, optional argument with React.memo. Again, in the real world, you'd likely
// use a comparison check, but here we know that we never want rerenders of this component, so we simply return true
// also note that when we DON'T want a rerender we return TRUE, this is the exact opposite with shouldComponentUpdate,
// where we would reaturn FALSE if we DON'T want a rerender
// https://reactjs.org/docs/react-api.html#reactmemo
const propsAreEqualSoWeShouldNotReRender = (prevProps, nextProps) => {
    return true;

    // What?? Why doesn't this work? Check the readme
    // if (prevProps.handleClick === nextProps.handleClick) {
    //     return true;
    // }
};

const Parent = memo((props) => {
    console.log("That React.memo means I don't waste rerenders");
    return (
        <div>
            <Child handleClick={props.handleClick}/>
        </div>
    )
}, propsAreEqualSoWeShouldNotReRender)

// This doesn't change from the class example. It's still a functional component that
const Child = ({ handleClick }) => {
    return (
        <div>
            <button onClick={handleClick}>Toggle</button>
        </div>
    )
}

export default GrandParent;