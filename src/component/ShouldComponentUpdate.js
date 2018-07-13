import React, {Component,Fragment} from 'react'

export default class ShouldComponentUpdate  extends  Component{

    state = {value:{name:'default name'}};

    shouldComponentUpdate(nextProps,nextState){
        //value 是引用类型，比较的内存地址，浅比较　，尝试直接比较ｎａｍｅ
        let ret = (this.state.value === nextState.value);
        console.log(`State.value is object ,so ret is always ${ret}.`);
        return !ret;
    }

    changeValue=()=>{
        let value = this.state.value;
        value.name = 'I have a new  name';
        this.setState({value:value});
    };

    render(){
        return (
            <Fragment>
                <div>we can get the changed value in own componet</div>
                <p>{this.state.value.name}</p>
                <button onClick={this.changeValue}>setState</button>
            </Fragment>
        );
    }
}