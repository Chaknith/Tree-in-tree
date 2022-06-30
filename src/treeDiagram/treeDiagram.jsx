import React, { useState, useEffect} from "react";
import Xarrow from "react-xarrows";
import "./treeDiagram.css";
import fakedata from "../data.json";

let boxStyle1con1 = {
  border: "2px solid grey",
  borderRadius: "10px",
  cursor: "pointer",
  margin: "20px",
  minWidth: "120px",
  maxWidth: "500px",
  width: "max-content",
  height: "80px",
  color: "black",
  background: "rgb(179, 248, 248) ",
  fontSize: "x-large",
  fontFamily: "monospace",
}; 

let boxStyle1con2 = {
  border: "2px solid grey",
  borderRadius: "10px",
  cursor: "pointer",
  margin: "20px",
  minWidth: "120px",
  maxWidth: "500px",
  width: "max-content",
  height: "80px",
  color: "black",
  background: null,
  fontSize: "x-large",
  fontFamily: "monospace",
};

let newboxStyle1con1 = boxStyle1con1;
newboxStyle1con1.height = "70px";
let newboxStyle1con2 = boxStyle1con2;
newboxStyle1con2.height = "70px";

function TreeDiagram() {
  const [data, setData] = useState();
  const [action, setAction] = useState([]);
  const [rerender, setRerender] = useState(false);

  let content = null;

  let headArray = [];
  let tailArray = [];
  // added code
  let content1 = [];
  let sortedData = [];
  let distance = 0;
  // ended adding code

  useEffect(() => {
    setTimeout(() => {
      setRerender(!rerender);
    }, 150);
  }, []);

  useEffect(() => {
    setData(fakedata);
  }, []);

  const handleID = (e) => {
    //console.log(e.target.id);
    //console.log(e.currentTarget.id);
  };

  if (data) {
//recursive call to organize the data into multiple dimension array
    function recurse(current, parent) {
      if (current.Parent === null) {
        parent.push(current);
      } else if (current.Parent === parent[0]._id) {
        parent.push({ children: [current] });
      } else {
        for (let i = 1; i < parent.length; i++) {
          recurse(current, parent[i].children);
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      recurse(data[i], sortedData);
    }
    console.log("==========printing sortedData===========")
    console.log(sortedData);
  }

  let hovertracking = [];

  const handleMouseEnter = (e) => {
    //console.log(e.currentTarget.id);
// track back function to find parents of the button the mouse is hovering on
    function findParent(current) {
      if (current[0]._id === e.currentTarget.id) {
        const givevalue = [current[0].Parent, current[0]._id];
        if (!hovertracking.includes(current[0]._id)) {
          hovertracking.push(current[0]._id);
          setAction((action) => [...action, current[0]._id]);
        }
        return givevalue;
      } else {
        for (let i = 1; i < current.length; i++) {
          const backvalue = findParent(current[i].children);
          if (backvalue) {
            if (backvalue[0] === current[0]._id) {
              if (!hovertracking.includes(current[0]._id)) {
                hovertracking.push(current[0]._id);
                setAction((action) => [...action, current[0]._id]);
              }
              return [current[0].Parent, findParent(current[i].children)];
            } else {
              findParent(current[i].children);
            }
          }
        }
      }
    }
    findParent(sortedData);
  };

  const handleMouseLeave = (e) => {
    setAction([]);
  };

  if (sortedData.length !== 0) {
    function drawidea(current) {
      if (current[0].type === "Idea") {
        let wanted = false;
        action.map((item) => {
          if (item === current[0]._id) {
            wanted = true;
          }
        });
        return (
          <table>
            <tr>
              <td>
                <button
                  key={current[0]._id}
                  id={current[0]._id}
                  style={wanted ? boxStyle1con1 : boxStyle1con2}
                  onClick={handleID}
                  onMouseOver={handleMouseEnter}
                  onMouseOut={handleMouseLeave}
                >
                  <h6>
                    {current[0].type} LV: {current[0].level}
                  </h6>
                  {current[0].detail}
                </button>
              </td>
              {current.map((item, index) => {
                if (index !== 0 && index < current.length) {
                  return <td>{drawidea(item.children)}</td>;
                }
              })}
            </tr>
          </table>
        );
      } else if (current[0].type === "Detail") {
        let wanted = false;
        action.map((item) => {
          if (item === current[0]._id) {
            wanted = true;
          }
        });
        return (
          <button
            key={current[0]._id}
            id={current[0]._id}
            style={wanted ? boxStyle1con1 : boxStyle1con2}
            onClick={handleID}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
          >
            <h6>
              {current[0].type} LV: {current[0].level}
            </h6>
            {current[0].detail}
          </button>
        );
      }
    }

    function recursedraw(current, connect) {
      if (current[0].Parent === null) {
        let wanted = false;
        action.map((item) => {
          if (item === current[0]._id) {
            wanted = true;
          }
        });
        let left = [];
        let right = [];
        left.push(
          <td>
            <button
              key={current[0]._id}
              id={current[0]._id}
              style={wanted ? boxStyle1con1 : boxStyle1con2}
              onClick={handleID}
              onMouseOver={handleMouseEnter}
              onMouseOut={handleMouseLeave}
            >
              <h6>{current[0].type}:</h6>
              {current[0].head}
            </button>
          </td>
        );
        current.map((item, index) => {
          if (index !== 0 && index < current.length) {
            right.push(
              <tr
                style={{
                  verticalAlign: "top",
                }}
              >
                {recursedraw(item.children)}
              </tr>
            );
          }
        });
        return (
          <tr
            style={{
              verticalAlign: "top",
            }}
          >
            {left}
            {right}
          </tr>
        );
      } else if (current[0].type === "Sub-Topic") {
        let wanted = false;
        action.map((item) => {
          if (item === current[0]._id) {
            wanted = true;
          }
        });
        let haveroot = false;
        let left = [];
        let firstbelow = [];
        let below = [];
        let right = [];
        let child = [];
        current.map((item, index) => {
          if (index !== 0 && index < current.length) {
            if (item.children[0].type !== "Sub-Topic") {
              child.push(<tr>{drawidea(item.children)}</tr>);
            } else {
              firstbelow.push(item);
              below.push(
                <tr
                  style={{
                    verticalAlign: "top",
                  }}
                >
                  {recursedraw(item.children)}
                </tr>
              );
              haveroot = true;
            }
          }
        });
        if (haveroot) {
          below.splice(0, 1);
          right.push(recursedraw(firstbelow[0].children, below));
        }

        left.push(
          <td>
            <button
              key={current[0]._id}
              id={current[0]._id}
              style={wanted ? newboxStyle1con1 : newboxStyle1con2}
              onClick={handleID}
              onMouseOver={handleMouseEnter}
              onMouseOut={handleMouseLeave}
            >
              <h6>
                {current[0].type} LV: {current[0].level}
              </h6>
              {current[0].detail}
            </button>
          </td>
        );

        return [
          <td>
            <table>
              {left}
              {child}
              {connect}
            </table>
          </td>,
          right,
        ];
      }
    }

    content1.push(recursedraw(sortedData));
  }

  if (data) {
    function getOffset(el) {
      const boxes = document.getElementById(el);
      if (boxes) {
        const rect = boxes.getBoundingClientRect();
        //console.log(boxes.getBoundingClientRect());
        return {
          left: rect.left,
          right: rect.right,
        };
      } else {
        return {
          left: 0,
          right: 0,
        };
      }
    }

    content = (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "200%",
          }}
        ></div>

        {data.map((item, index) => {
          if (
            data[index].type === "Topic" ||
            data[index].type === "Sub-Topic"
          ) {
            if (data[index].level) //console.log("Add document to headArray");
            headArray.push(data[index]);
          }
        })}

        {data.map((item, index) => {
          if (
            data[index].type === "Idea" ||
            data[index].type === "Detail"
          ) {
            //console.log("Create Button for Kaizen");
          }
        })}

        {data.map((item, index) => {
          if (
            data[index].type === "Idea" ||
            data[index].type === "Detail"
          ) {
            //console.log("Add document to tailArray");
            tailArray.push(data[index]);
          }
        })}

        {/* ending code */}

        {headArray.map((item, index) => {
          if (index < headArray.length) {
            if (headArray[index].Parent === null) {
              return console.log("parent = null");
            } else {
              distance =
                (getOffset(headArray[index]._id).left -
                  getOffset(headArray[index].Parent).right) /
                2;
              distance = distance - 40;

              return (
                <Xarrow
                  key={index}
                  path="grid"
                  start={headArray[index].Parent} 
                  end={headArray[index]._id} 
                  startAnchor="right"
                  endAnchor="left"
                  _cpx1Offset={distance}
                  _cpx2Offset={distance}
                  strokeWidth={1}
                />
              );
            }
          }
        })}

        {tailArray.map((item, index) => {
          if (
            index < tailArray.length &&
            tailArray[index].type === "Idea"
          ) {
            return (
              <Xarrow
                key={index}
                path="grid"
                start={tailArray[index].Parent} //can be react ref
                end={tailArray[index]._id} //or an id
                startAnchor="left"
                endAnchor="left"
                _cpx1Offset={-25}
                _cpx2Offset={-25}
                strokeWidth={1}
              />
            );
          } else {
            return (
              <Xarrow
                key={index}
                path="grid"
                start={tailArray[index].Parent}
                end={tailArray[index]._id}
                strokeWidth={1}
              />
            );
          }
        })}

      </div>
    );
  }
  return (
    <div>
      <div>
        <br></br>
          <h1>Tree in Tree </h1>
      </div>
      <div
        style={{
          width: "inherit",
          gridRow: 1,
          gridColumn: 1,
        }}
      >
        {content}
      </div>
      <table>
        {content1}
      </table>
    </div>
  );
}

export default TreeDiagram;