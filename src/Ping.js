import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const Ping = () => {
  var [rangeValue, setRangeValue] = useState(4);
  let [pingState, setPingState] = useState({ host: "", count: 4 });
  let [output, setOutput] = useState("");
  let [topPing, setTopPings] = useState(null);

  const ping = async () => {
    if (pingState.host !== "") {
      try {
        var res = await axios.post("http://localhost:5000/ping", pingState);

        setOutput(res.data.output);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getTopPings();
  });
  var onChangePing = (e) => {
    setPingState({ ...pingState, [e.target.name]: e.target.value });
  };

  const getTopPings = () => {
    axios
      .get("http://localhost:5000/pings")
      .then((res) => setTopPings(res.data.pings));
  };
  return (
    <div>
      <form>
        <label>Ping Form</label>
      </form>
      <form>
        <label>
          Host:
          <input type="text" name="host" onChange={onChangePing} />
        </label>
      </form>
      <form>
        <label>
          Count:
          <input
            type="range"
            min="1"
            max="100"
            className="slider"
            id="myRange"
            onInput={(e) => {
              setRangeValue(e.target.value);
              setPingState({ ...pingState, count: e.target.value });
            }}
          />
        </label>
        <span id="range">{rangeValue}</span>
      </form>

      <button onClick={ping}>Run</button>

      <form>
        <label>OutPut:</label>
      </form>
      <form>
        <textarea rows="10" cols="40" value={output} />
      </form>
      <div className="App">
        <table>
          <tr>
            <th>Top Ping Sites</th>
            <th> </th>
          </tr>
          {topPing &&
            topPing.map((ping) => {
              return (
                <tr>
                  <td>{ping.host}</td>
                  <td>{ping.pingCount}</td>
                </tr>
              );
            })}
        </table>
      </div>
    </div>
  );
};
export default Ping;
