# redux示例: TodoList

需下载`antd`

## 入口文件

#### `index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Todo from "./page/Todo";

ReactDOM.render(<Todo />, document.getElementById("root"));
```

## 创建 数据store文件夹

#### `store/index.js`

```js
import { createStore } from "redux"; // 引入createStore方法

// reducer
const defaultState = {
  inputValue: "",
  list: ["早上4点起床，锻炼身体", "中午下班游泳一小时"],
}; // 默认数据

const reducer = (state = defaultState, action) => {
  let newState = state;
  switch (action.type) {
    case "changeInupt":
      // 获得原始state
      // 修改inputValue
      newState.inputValue = action.inputValue;
      // 返回新的newState
      return newState;
    //   return { ...state, ...{ inputValue: action.inputValue } };  // 也可以用...运算符，赋值返回

    case "changeList":
      newState.list.push(newState.inputValue);
      newState.inputValue = "";
      return newState;
    case "deleteItem":
      //   console.log(action);
      newState.list.splice(action.inde, 1);
      return newState;
    default:
      break;
  }
  return state;
};

// ------------------------------------------------------

// index
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // 配置这个Redux Dev Tools插件
); // 创建数据存储仓库
export default store; // 暴露出去

```

## 展示页

#### `page/Todo.js`

```js
import React from "react";
import { Layout, Input, List } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import store from "../store";

const { Header, Content } = Layout;

class Todo extends React.Component {
  constructor(prop) {
    super(prop);
    // 获取store中的数据初始化state
    console.log(this.state, "this.state");
    this.state = store.getState();
    store.subscribe(() => {
      this.setState(store.getState());
    }); //订阅Redux的状态
  }
  render() {
    const { inputValue, list } = this.state;
    return (
      <React.Fragment>
        <Layout>
          <Header style={{ color: "#fff", textAlign: "center" }}>
            TodoList
          </Header>
          <Content
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <Input
              size="large"
              style={{ width: "50%", minWidth: "700px", margin: "20px" }}
              onChange={this.onChangeInupt}
              onPressEnter={this.onPressEnter}
              value={inputValue}
              placeholder="Write Something"
            ></Input>
            <List
              size="large"
              style={{ width: "50%", minWidth: "700px" }}
              bordered
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <CloseCircleOutlined
                      style={{ color: "red" }}
                      onClick={this.deleteItem.bind(this, index)}
                    />,
                  ]}
                >
                  {item}
                </List.Item>
              )}
            />
          </Content>
        </Layout>
      </React.Fragment>
    );
  }

  onChangeInupt = (e) => {
    // console.log(e.target.value, "e.target.value");
    const action = {
      type: "changeInupt",
      inputValue: e.target.value,
    };
    store.dispatch(action);
  };
  // input 输入回车时调用
  onPressEnter = () => {
    const action = {
      type: "changeList",
    };
    store.dispatch(action);
  };
  // 删除一条记录
  deleteItem = (index) => {
    console.log(index);
    const action = {
      type: "deleteItem",
      inde: index,
    };
    store.dispatch(action);
  };
}
export default Todo;

```

<img src="C:\Users\小陈啊\Desktop\notes\学习\images\redux-1.png" style="zoom: 50%;" />