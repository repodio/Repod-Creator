const initialState = {
  server: "",
  client: "",
  counter: 0,
};

// Creating my reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FOO":
      return { ...state, counter: action.payload };
    default:
      return state;
  }
}
