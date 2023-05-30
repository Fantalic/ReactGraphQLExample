import { useEffect, useState } from "react";
import useGetData from "../hooks/useGetData";
import { IHeaderInfo } from "../types";

function Table() {
  const { load, data } = useGetData();
  const [nodes, setNodes] = useState<Record<string,any>[]>([]);
  const [headerState, setHeaderState] = useState<IHeaderInfo>({});

  const [hoverId, setHoverId] = useState<number>(-1);
  const [showColumnSelect, setShowColumnSelect] = useState<boolean>(false);

  useEffect(()=>{load()},[load])

  useEffect(() => {
    const tempNodes:Record<string,any>[] = []
    data?.allPeople?.edges.map((e:{node:Record<string,any>})=>{
      tempNodes.push(e.node)
    })
    setNodes(tempNodes)    
    
    const headers: IHeaderInfo = {};
    if (tempNodes.length > 0) {
      for (const key in tempNodes[0]) {
        if (["__typename", "id", "filmConnection"].includes(key)) {
          continue;
        }
        headers[key] = { visible: true, sort: "" };
      }      
      setHeaderState(headers);
    }
  }, [data] );

  const getCell = (node: Record<string, any>, headKey: string) => {
    return headKey === "homeworld" ? node?.[headKey]?.name : node?.[headKey];
  };

  const setColVisible = (key: string, b:boolean) => {
    setHeaderState((prevHeader) => ({
      ...prevHeader,
      [key]: { ...prevHeader[key], visible: b },
    }));
  };

  const sortNodes = (key: string, direction: "up" | "down") => {
    const sortedNodes = [...nodes].sort((a: Record<string, any>, b: Record<string, any>) => {
      if (direction === "up") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setNodes(sortedNodes)
  };

  return (
    <div>
      <button onClick={() => setShowColumnSelect(!showColumnSelect)}>Select Columns</button>
      { showColumnSelect && (
        Object.keys(headerState).map((colName) => (
          <div key={colName}>
            <input 
              type="checkbox" 
              id={colName} 
              checked={headerState[colName].visible}
              onChange={()=>setColVisible(colName,!headerState[colName].visible)}/>
            <label > {colName}</label>
          </div>
          
        ))
      )}
      {nodes && (      
        <table>
          <thead>
            <tr>
              {Object.keys(headerState).map((colName, i) => headerState[colName].visible  && (
                <th
                  key={colName}
                  onMouseEnter={() => setHoverId(i)}
                  onMouseLeave={() => setHoverId(-1)}
                  style={{ backgroundColor: i === hoverId ? "blue" : "black" }}
                >
                  <div>{colName}</div>
                  {i === hoverId && (
                    <div>
                      <button title="Remove Column" onClick={() => setColVisible(colName,false)}>
                        x
                      </button>
                      <button title="Sort Down" onClick={() => sortNodes(colName, "down")}>
                        v
                      </button>
                      <button title="Sort Up" onClick={() => sortNodes(colName, "up")}>
                        ^
                      </button>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((n: Record<string, any>) => (
              <tr key={n.id}>
                {Object.keys(headerState).map((key) => headerState[key].visible &&  (
                  <td key={key}>{getCell(n, key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
}

export default Table;
