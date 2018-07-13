import React, {Component,Fragment} from 'react'

export default class Parameter  extends  Component{

    state = {numberFunction:0, numberObject: 0};

    changeNumberObject=()=>{

        this.setState(
            {numberObject:this.state.numberObject+1}
        );

         this.setState(
            {numberObject:this.state.numberObject+1}
        );

         this.setState(
            {numberObject:this.state.numberObject+1}
         );

          this.setState(
            {numberObject:this.state.numberObject+1}
         );
    };

    changeNumberFunction=()=>{

        this.setState((preState)=>{
            return  {numberFunction:preState.numberFunction+1}
        })

        this.setState((preState)=>{
            return  {numberFunction:preState.numberFunction+1}
        })

        this.setState((preState)=>{
            return  {numberFunction:preState.numberFunction+1}
        })

        this.setState((preState)=>{
            return  {numberFunction:preState.numberFunction+1}
        })
    };

    componentDidUpdate(){
        console.log(`The expected  numberObject is 4,real value is ${this.state.numberObject}`);
        console.log(`The expected  numberFunction is 4,real value is ${this.state.numberFunction}`);
    }

    render(){
        return (
            <Fragment>
                <div>First parameter is object and call setstate many times</div>
                <p>Number Object:{this.state.numberObject}</p>
                <button onClick={this.changeNumberObject}>Number Object</button>

                <div>First parameter is function and call setstate many times</div>
                <p>Number Function:{this.state.numberFunction}</p>
                <button onClick={this.changeNumberFunction}>Number Function</button>
            </Fragment>
        );
    }
}