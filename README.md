作者 : 墨成

React 版本 :16.4.1

仔细阅读官网setState的描述会发现里面透露的信息量巨大，我也建议初学者在学习 React之前仔细阅读原始文档，以下是我个人在阅读文档时的一些领悟，配合了一些翻译和讲解，限于个人水平，不足之处，各位请多多指出

setState(updater[, callback])
setState() enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

翻译: setState()通过队列的形式保存组件状态并告诉React这个组件和他的子组件需要重新渲染。这是我们通过事件或服务器响应更新用户接口的主要方法(也就是说我们最常用)

解释:无

Think of setState() as a request rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

翻译: setState()只是作为一个请求而不是一个立刻执行的指令去更新组件。为了更好的性能，React会延迟执行，然后通过一种单一(这个单一在这里的意思是归类的意思)的方式去更新几个组件。React不会立刻把state的改变应用到组件上

解释:这句的话的意思很明显就是告诉你 : React的 setState是"异步"的，React 在没有重新渲染之前对state的做了一些处理以达到最佳的性能，实例代码：

//Async.js
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
//the result
Before change,value is default value
After change,value is default value
Casue setState is asynchronous ,so you will see the same value in this function
setState() does not always immediately update the component. It may batch or defer the update until later. This makes reading this.state right after calling setState() a potential pitfall. Instead, use componentDidUpdate or a setState callback (setState(updater, callback)), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the updater argument below.

翻译: setState()并不总是立刻更新组件(言下之意就是有办法可以立刻更新，后面会讲道这部分内容)。随后它会使用批处理或延迟更新 。在你调用setState()后立刻读取 this.state的值不会生效(原文叫 潜在的陷阱)。相反，使用componentDidUpdate 或者 setState 回调函数 的任意一种方式都会让对state的更新生效(原文的作者使用了 fire这个词非常形象，想象一下这样的一种场景:你为了一个难题彻夜难眠，绞尽脑汁，突然看到了火(黑暗前的黎明，激动)是希望！！).如果你想基于上一个state来设置state，请阅读下方updater的参数

解释:setSate虽然是异步的，但是我们还是可以通过其他方式读取到生效的值，比如在react生命周期函数 componentDidUpdate 和 setState的回调函数中读取 。言下之意是告诉我们在 setState完成后，会激活 componentDidUpdate 周期函数，有回调函数会执行回调函数。实例代码：

//DidUpdateOrCallback.js

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

//result:
Before change,value is default value
Look at the value in componentDidUpdate(),value is I have a new  value
Look at the value in setState callback function,value is I have a new  value
setState() will always lead to a re-render unless shouldComponentUpdate() returns false. If mutable objects are being used and conditional rendering logic cannot be implemented in shouldComponentUpdate(), calling setState() only when the new state differs from the previous state will avoid unnecessary re-renders.

翻译: setState总是会触发重渲染，除非shouldComponentUpdate() 返回 false .shouldComponentUpdate()不应该包含可变对象作为条件渲染的逻辑，我们仅仅在state发生变化去调用setSate而避免不必要的重新渲染

解释:shouldComponentUpdate()的逻辑中直接比较引用类型是不可以发挥它的作用，就是说对于引用类型，地址总是相同，返回值永远为true(浅比较).比如:


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
这里你会发现 ret 的值永远为 true,shouldComponentUpdate()总是返回 false,不会触发re-render.

The first argument is an updater function with the signature:

(prevState, props) => stateChange
prevState is a reference to the previous state. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from prevStateand props. For instance, suppose we wanted to increment a value in state by props.step:

翻译:prevState 是上一个状态的引用. 它不应该直接被改变。这种变化应该是基于 prevState和 props构建的一个新对象。比如，假如我们想在state中通过props.step去对一个值做增量操作:

解释：无

this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
Both prevState and props received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with prevState.

翻译: updater function 保证接受到的prevState和props是最新的(这里的最新是相对于上次 render后的值，而不是连续调用setState的值，这里可能会让有些人有点误解)。调用updater function是浅合并(这里有故事)

解释：无

The second parameter to setState() is an optional callback function that will be executed once setState is completed and the component is re-rendered. Generally we recommend using componentDidUpdate() for such logic instead.

翻译:第二个是可选的回调函数，它会在setState完成后并且组件重新渲染后立刻执行。一般来说，我们推荐使用componentDidUpdate() 来替换这个逻辑。

解释: 如果使用回调函数，React 更建议在componentDidUpdate来处理这个逻辑。就是这个回调函数在没有特别必要的情况下不要使用(源码对callback做了很多逻辑处理，后面也会提及)

You may optionally pass an object as the first argument to setState() instead of a function:

setState(stateChange[, callback])
翻译：你可以有选择性的传递一个对象作为setState的第一参数

解释: 除了传递函数之外也可以使用对象作为参数

This performs a shallow merge of stateChange into the new state, e.g., to adjust a shopping cart item quantity:

this.setState({quantity: 2})
翻译：它会执行浅合并来生成一个新的state，比如说:修改购物车里的商品数量

This form of setState() is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
翻译：这种形式的 setState()（把对象作为参数）也是"异步"的,相同周期（这个cycle的翻译我还没找到合适的词，暂且使用周期，比如同一个函数多次调用setState，我们就认为他们在同一个周期）的多次调用会被批量执行。比如，如果你试图在同一周期多次增加商品的数量，那么它的结果等同于:

解释:这里的例子非常关键，要理解它必须完全理解Object.assign合并对象的原理，比如说，不同对象相同属性，后面的对象会覆盖前面的对象;不同对象不同属性，会合并到最终的对象上,这里也写了一个demo：


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
     //只有最后这个setState才生效 
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
    //每个都回执行 
};

componentDidUpdate(){
    console.log(`The expected  numberObject is 4,real value is ${this.state.numberObject}`);
    console.log(`The expected  numberFunction is 4,real value is ${this.state.numberFunction}`);
}
Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the previous state, we recommend using the updater function form, instead:

this.setState((prevState) => {
  return {quantity: prevState.quantity + 1};
});
翻译：在同一周期靠后的setState()将会覆盖前一个setSate()的值(相同属性名)，因此，这个商品数量仅自增了一次，如果希望下一个state依赖上一个state，我们推荐使用函数的形式

解释:这里很明显的告诉我们，setSate第一参数传递的对象或函数,react的处理方式不一样， 这跟React在性能优化有很大关系，为了最小可能性去re-render（重渲染），React源码作了很多额外的工作

至此，官方文档对setState()的概要描述已经结束

后面我会对官方的文档的解释写一些demo来验证

同时随着理解的深入，后面会不断对源码进行解析

未完待续..........

作者 : 墨成

React 版本 :16.4.1

仔细阅读官网setState的描述会发现里面透露的信息量巨大，我也建议初学者在学习 React之前仔细阅读原始文档，以下是我个人在阅读文档时的一些领悟，配合了一些翻译和讲解，限于个人水平，不足之处，各位请多多指出

setState(updater[, callback])
setState() enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

翻译: setState()通过队列的形式保存组件状态并告诉React这个组件和他的子组件需要重新渲染。这是我们通过事件或服务器响应更新用户接口的主要方法(也就是说我们最常用)

解释:无

Think of setState() as a request rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

翻译: setState()只是作为一个请求而不是一个立刻执行的指令去更新组件。为了更好的性能，React会延迟执行，然后通过一种单一(这个单一在这里的意思是归类的意思)的方式去更新几个组件。React不会立刻把state的改变应用到组件上

解释:这句的话的意思很明显就是告诉你 : React的 setState是"异步"的，React 在没有重新渲染之前对state的做了一些处理以达到最佳的性能，实例代码：

//Async.js
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
//the result
Before change,value is default value
After change,value is default value
Casue setState is asynchronous ,so you will see the same value in this function
setState() does not always immediately update the component. It may batch or defer the update until later. This makes reading this.state right after calling setState() a potential pitfall. Instead, use componentDidUpdate or a setState callback (setState(updater, callback)), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the updater argument below.

翻译: setState()并不总是立刻更新组件(言下之意就是有办法可以立刻更新，后面会讲道这部分内容)。随后它会使用批处理或延迟更新 。在你调用setState()后立刻读取 this.state的值不会生效(原文叫 潜在的陷阱)。相反，使用componentDidUpdate 或者 setState 回调函数 的任意一种方式都会让对state的更新生效(原文的作者使用了 fire这个词非常形象，想象一下这样的一种场景:你为了一个难题彻夜难眠，绞尽脑汁，突然看到了火(黑暗前的黎明，激动)是希望！！).如果你想基于上一个state来设置state，请阅读下方updater的参数

解释:setSate虽然是异步的，但是我们还是可以通过其他方式读取到生效的值，比如在react生命周期函数 componentDidUpdate 和 setState的回调函数中读取 。言下之意是告诉我们在 setState完成后，会激活 componentDidUpdate 周期函数，有回调函数会执行回调函数。实例代码：

//DidUpdateOrCallback.js

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

//result:
Before change,value is default value
Look at the value in componentDidUpdate(),value is I have a new  value
Look at the value in setState callback function,value is I have a new  value
setState() will always lead to a re-render unless shouldComponentUpdate() returns false. If mutable objects are being used and conditional rendering logic cannot be implemented in shouldComponentUpdate(), calling setState() only when the new state differs from the previous state will avoid unnecessary re-renders.

翻译: setState总是会触发重渲染，除非shouldComponentUpdate() 返回 false .shouldComponentUpdate()不应该包含可变对象作为条件渲染的逻辑，我们仅仅在state发生变化去调用setSate而避免不必要的重新渲染

解释:shouldComponentUpdate()的逻辑中直接比较引用类型是不可以发挥它的作用，就是说对于引用类型，地址总是相同，返回值永远为true(浅比较).比如:


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
这里你会发现 ret 的值永远为 true,shouldComponentUpdate()总是返回 false,不会触发re-render.

The first argument is an updater function with the signature:

(prevState, props) => stateChange
prevState is a reference to the previous state. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from prevStateand props. For instance, suppose we wanted to increment a value in state by props.step:

翻译:prevState 是上一个状态的引用. 它不应该直接被改变。这种变化应该是基于 prevState和 props构建的一个新对象。比如，假如我们想在state中通过props.step去对一个值做增量操作:

解释：无

this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
Both prevState and props received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with prevState.

翻译: updater function 保证接受到的prevState和props是最新的(这里的最新是相对于上次 render后的值，而不是连续调用setState的值，这里可能会让有些人有点误解)。调用updater function是浅合并(这里有故事)

解释：无

The second parameter to setState() is an optional callback function that will be executed once setState is completed and the component is re-rendered. Generally we recommend using componentDidUpdate() for such logic instead.

翻译:第二个是可选的回调函数，它会在setState完成后并且组件重新渲染后立刻执行。一般来说，我们推荐使用componentDidUpdate() 来替换这个逻辑。

解释: 如果使用回调函数，React 更建议在componentDidUpdate来处理这个逻辑。就是这个回调函数在没有特别必要的情况下不要使用(源码对callback做了很多逻辑处理，后面也会提及)

You may optionally pass an object as the first argument to setState() instead of a function:

setState(stateChange[, callback])
翻译：你可以有选择性的传递一个对象作为setState的第一参数

解释: 除了传递函数之外也可以使用对象作为参数

This performs a shallow merge of stateChange into the new state, e.g., to adjust a shopping cart item quantity:

this.setState({quantity: 2})
翻译：它会执行浅合并来生成一个新的state，比如说:修改购物车里的商品数量

This form of setState() is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
翻译：这种形式的 setState()（把对象作为参数）也是"异步"的,相同周期（这个cycle的翻译我还没找到合适的词，暂且使用周期，比如同一个函数多次调用setState，我们就认为他们在同一个周期）的多次调用会被批量执行。比如，如果你试图在同一周期多次增加商品的数量，那么它的结果等同于:

解释:这里的例子非常关键，要理解它必须完全理解Object.assign合并对象的原理，比如说，不同对象相同属性，后面的对象会覆盖前面的对象;不同对象不同属性，会合并到最终的对象上,这里也写了一个demo：


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
     //只有最后这个setState才生效 
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
    //每个都回执行 
};

componentDidUpdate(){
    console.log(`The expected  numberObject is 4,real value is ${this.state.numberObject}`);
    console.log(`The expected  numberFunction is 4,real value is ${this.state.numberFunction}`);
}
Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the previous state, we recommend using the updater function form, instead:

this.setState((prevState) => {
  return {quantity: prevState.quantity + 1};
});
翻译：在同一周期靠后的setState()将会覆盖前一个setSate()的值(相同属性名)，因此，这个商品数量仅自增了一次，如果希望下一个state依赖上一个state，我们推荐使用函数的形式

解释:这里很明显的告诉我们，setSate第一参数传递的对象或函数,react的处理方式不一样， 这跟React在性能优化有很大关系，为了最小可能性去re-render（重渲染），React源码作了很多额外的工作

至此，官方文档对setState()的概要描述已经结束


