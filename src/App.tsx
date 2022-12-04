import "./styles.css";
import React, { useState, useReducer, useRef } from "react";
import { PostType } from "./models/post.interface";
import { Post } from "./api/api";
import Posts from "./Posts";

//reducerで保持するstateの型
interface stateType {
  date: PostType;
  isError: boolean;
  isLoading: boolean;
}
//dispatchするとき依存元から受け取る値の型
//type:処理を分ける判定用、
//payload:実際にuseEffectから受け取るレスポンスの値の型
type ACTIONTYPE =
  | { type: "OnSuccess"; payload: PostType }
  | { type: "OnFailure"; payload: PostType };

//OnFailureに入れるnullPostType値
const nullDate: PostType = {
  id: 0,
  userId: 0,
  title: "",
  body: 0
};

//useReducer宣言時に指定する初期値
const initialState: stateType = {
  date: nullDate,
  isError: false,
  isLoading: true
};

//reducer本体の関数、ここに具体的に値の保持方法を記載
const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
  switch (action.type) {
    case "OnSuccess":
      return {
        date: action.payload,
        isError: false,
        isLoading: false
      };
    case "OnFailure":
      return {
        date: nullDate,
        isError: true,
        isLoading: false
      };
    default:
      return state;
  }
};

export default function App() {
  //ボタンがクリックされたかどうかの状態を保持するstate
  const [isPushButton, setsPushButton] = useState<boolean>(true);
  //レスポンスを保持するreducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputEl = useRef(null);

  //ボタンクリック時動作する関数
  const onButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setsPushButton((prevValue) => !prevValue);
    //inpotのvalueをUseRef：inputELから取得するsetId変数
    let setId: number = inputEl.current.value
      ? Number(inputEl.current.value)
      : 0;
    //APIfetch開始
    Post.getAPost(setId)
      .then((response) => {
        //レスポンス結果をuseReducerにてセット
        dispatch({ type: "OnSuccess", payload: response });
        console.log(state);
      })
      .catch((err) => {
        //エラー時はレスポンス時は空PostTypeを渡す
        dispatch({ type: "OnFailure", payload: nullDate });
      });
    console.log(isPushButton);
  };

  return (
    <div className="App">
      <h1>id入力してボタンクリックしたら該当idのPostをfetch</h1>
      <form>
        <label id="fnamel">id:</label>
        <input ref={inputEl} type="text" id="fname" name="fname" />
      </form>
      <button type="button" onClick={onButtonClick}>
        StartFetch!
      </button>
      {state.isLoading ? (
        <p>Now loading</p>
      ) : state.isError ? (
        <p>API call Error</p>
      ) : (
        <Posts
          key={state.date.id}
          id={state.date.id}
          userId={state.date.userId}
          title={state.date.title}
          body={state.date.body}
        />
      )}
    </div>
  );
}
