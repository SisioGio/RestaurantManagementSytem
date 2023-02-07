import React from "react";
import SizeRow from "./rows/sizeRow";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
function Size() {
  const [data, setData] = React.useState([]);
  const dispatch = dispatchFeedbackContexts();

  const updateValues = async () => {
    try {
      let res = await apiService.getSizes();

      setData(res.data);
    } catch (err) {
      console.log(err);
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
  };
  React.useEffect(() => {
    updateValues();
  }, []);

  return (
    <div id="table">
      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {!data ? (
            <p>Waiting to fetch data...</p>
          ) : (
            data.map((row) => {
              return <SizeRow new={false} update={updateValues} row={row} />;
            })
          )}
          <SizeRow new={true} update={updateValues} row={{ name: "" }} />
        </tbody>
      </table>
    </div>
  );
}

export default Size;
