import React, {Component,Fragment} from 'react'

export default class DidUpdateOrCallback  extends  Component{

    state = {value:'default value'};

    changeValue=()=>{
        console.log(`Before change,value is ${this.state.value}`);
        this.setState(
            {value:'I have a new  value'}
        ,()=>{
            console.log(`Look at the value in setState callback function,value is ${this.state.value}`);
        })
    };

    componentDidUpdate(){
        console.log(`Look at the value in componentDidUpdate(),value is ${this.state.value}`);
    }

    render(){
        return (
            <Fragment>
                <div>we can get the changed value in own componet</div>
                <p>{this.state.value}</p>
                <button onClick={this.changeValue}>setState</button>
            </Fragment>
        );
    }
}