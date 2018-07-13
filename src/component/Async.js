import React, {Component,Fragment} from 'react'

export default class Async  extends  Component{

    state = {value:'default value'};

    changeValue=()=>{
        console.log(`Before change,value is ${this.state.value}`);
        this.setState(
            {value:'I have a new  value'}
        )
        // 通过setState修改了state中value的值，打印的结果并不是最新的值，即修改没有生效
        console.log(`After change,value is ${this.state.value}`);
        console.log(`Casue setState is asynchronous ,so you will see the same value in this function`);
    };

    render(){
        return (
            <Fragment>
                <div>this zone just prove setState is asynchronous</div>
                <p>{this.state.value}</p>
                <button onClick={this.changeValue}>setState</button>
            </Fragment>
        );
    }
}