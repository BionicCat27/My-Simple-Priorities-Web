import { useContext, useEffect, useState } from "react";
import { DBContext } from "../contexts/DBContext";
import NavMenu from "./components/NavMenu/NavMenu";
import { Card } from "./components/Card";
import { EditableInput } from "./components/EditableInput";
import { useLocation } from "react-router";

const ScreensPage = () => {
    const {addDataListener, pushObject, ready} = useContext(DBContext)

    const [screens, setScreens] = useState([]);
    const [types, setTypes] = useState([]);
    const [input, setInput] = useState("");

    const location = useLocation()

    const pagePath = `screens`

    useEffect(()=> {
        if (ready) {
            addDataListener(pagePath, setScreens, true)
            addDataListener(`types`, setTypes)
        }
    }, [ready])

    function addContent(event) {
        event.preventDefault();
        pushObject(pagePath, {
            'name': input
        })
        setInput("");
    }
    if(location.pathname === '/screens') {
        return (
            <>
                <NavMenu title="Screens"/>
               <div>
                    <form onSubmit={addContent} id="contentForm">
                        <input autoFocus placeholder="Screen Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                        <button id="addContentButton" onClick={addContent}>Create</button>
                    </form>
                    <h1>Screens</h1>
                    {
                        screens && screens.map(screen => 
                            <ScreenCard card={screen}
                            types={types}
                            path={pagePath}/>
                            )
                        }
                </div>
            </>
        )
    }
    let screenKey = location.pathname.split("/")[2];
    return (<ScreenPage path={`${pagePath}`} screenKey={screenKey}/>);
}

const ScreenPage = (props) => {
    const {addDataListener, ready, pushObject, asKeyedList} = useContext(DBContext);
    
    const displaysMap = {
        'displays/list': {
            'name': 'List'
        }
    }
    const displaysList = asKeyedList(displaysMap);

    const screenKey = props.screenKey;
    const screenPath = `${props.path}/${screenKey}`;

    
    const [screen, setScreen] = useState();
    const [input, setInput] = useState("");
    
    useEffect(()=>{
        if(ready) {
            addDataListener(screenPath, setScreen);
        }
    },[ready])
    
    function addContent(event, path) {
        event.preventDefault();
        pushObject(path, {
            'name': input
        })
        setInput("");
    }
    if(!screen) return;
    const configuration = screen.configuration;
    const screenDisplays = asKeyedList(screen.displays);
    let screenTypes = asKeyedList(screen.types);
    let screenType;
    if (screenTypes?.length >= 1) {
        screenType = screenTypes[0];
    } else {
        return <>
        <NavMenu title={screen.name} />
        <p>No type associated with screen "{screen.name}."</p>
        <p><a href="/types">Create a Type</a> or <a href="/screens">Manage screens</a></p>
        </>;
    }
    let typePath = `types/${screenType.typeKey}/data`;
    return (
        <>
            <NavMenu title={screen.name}/>
            <form onSubmit={event => addContent(event, typePath)} id="contentForm">
                <input autoFocus placeholder="Name" value={input} onChange={field => setInput(field.target.value)} type="text" className="content_field" />
                <button id="addContentButton" onClick={event => addContent(event, typePath)}>Create</button>
            </form>
            <div className={`flex-aligned-${configuration?.displays?.alignment}`}>
                {
                    screenDisplays && screenDisplays.map((display)=>{
                        if (!display) return;
                        const displayType = display.displayKey;
                        if (displayType === 'displays/list') {
                            return (
                                <ListDisplay type={screenType} />
                            )
                        }
                    })
                }
            </div>
        </>
    )
}

const ListDisplay = (props) => {
    const {ready, addDataListener} = useContext(DBContext);
    const type = props.type;
    const [data, setData] = useState([]);

    const displayPath = `types/${type.typeKey}/data`;

    useEffect(()=>{
        if (!ready) return;
        addDataListener(displayPath, setData, true)
    }, [ready])

    if (!data) return;
    return (
        <div key={`listDisplay/${type.typeKey}`} style={{width: "100%"}}>
            {data && data.map((datum)=> {
                return <ListCard card={datum} 
                path={displayPath}/>;
            })}
        </div>
    )
}

const ListCard = (props) => {
    const {updateObject} = useContext(DBContext);
    const card = props.card;
    if (!card) return <div className="card">No card prop found</div>;
    const cardPath = `${props.path}/${card.key}`

    const [input, setInput] = useState(card.name);

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
    }

    return (
        <Card card={card}
            cardPath={cardPath} 
            updateContent={updateContent}
            resetContent={resetContent}
            viewComponent={
                <h3>{card.name}</h3>   
            }
            editComponent={
                <>
                    <EditableInput label={"Name"} value={input} setValue={setInput} />
                </>
            }
            />
    )
}

const ScreenCard = (props) => {

    const {updateObject, pushObject, removeObject, asKeyedList} = useContext(DBContext)

    const card = props.card;
    if (!card) return;
    const cardPath = `${props.path}/${card.key}`;
    const displaysMap = {
        'displays/list': {
            'name': 'List'
        }
    }
    const displaysList = asKeyedList(displaysMap);
    const types = props.types;
    const typesList = asKeyedList(types);
    const screenTypes = asKeyedList(card.types);
    const configuration = card.configuration;
    const screenDisplays = asKeyedList(card.displays);

    const defaultSelectorInput = "None";

    const [input, setInput] = useState(card.name);
    const [typeSelectorInput, setTypeSelectorInput] = useState(defaultSelectorInput);
    const [displaySelectorInput, setDisplaySelectorInput] = useState(defaultSelectorInput);
    
    function addSelected(path, value, keyName) {
        if (value === defaultSelectorInput) {
            return;
        }
        let obj = {};
        obj[keyName] = value;
        pushObject(path, obj);
    }

    function toggleDisplayAlignment() {
        let value = true;
        if (configuration?.displays?.alignment == undefined) {
            value = true;
        } else {
            value = !configuration.displays.alignment
        }
        updateObject(`${cardPath}/configuration`, "displays/alignment", value)
    }

    function updateContent() {
        updateObject(cardPath, "name", input || "");
    }

    function resetContent() {
        setInput(card.name);
    }


    return (
        <Card card={card}
            cardPath={cardPath} 
            updateContent={updateContent}
            resetContent={resetContent}
            viewComponent={
                <h3>{card.name}</h3>   
            }
            editComponent={
                <>
                    <EditableInput label={"Name"} value={input} setValue={setInput} />
                    <label>Associated Types</label>
                    {
                        screenTypes && screenTypes.map(screenType => {
                            let type = types[screenType.typeKey];
                            if(!type) return;
                            return (
                                <div className="card" key={`typeCard/${screenType.key}`}>
                                    <p>{type.name}</p>
                                    <button onClick={()=>{removeObject(`${cardPath}/types/${screenType.key}`)}}>Remove</button>
                                </div>
                            );
                        })
                    }
                    <select value={typeSelectorInput} onChange={field => setTypeSelectorInput(field.target.value)}>
                        <option>{defaultSelectorInput}</option>
                        {typesList && typesList.map(type => <option value={type.key} key={`typeOption/${type.key}`}>{type.name}</option>)}
                    </select>
                    <button onClick={()=>{addSelected(`${cardPath}/types`, typeSelectorInput, "typeKey")}}>Associate Type</button>
                    <label>Displays</label>
                    {
                        screenDisplays && screenDisplays.map(display => {
                            return (
                                <div className="card" key={`screenCard/display/${display.key}`}>
                                    <p>{displaysMap[display.displayKey].name}</p>
                                    <button onClick={()=>{removeObject(`${cardPath}/displays/${display.key}`)}}>Remove</button>
                                </div>
                            );
                        })
                    }
                    <select value={displaySelectorInput} onChange={field => setDisplaySelectorInput(field.target.value)}>
                        <option>{defaultSelectorInput}</option>
                        {displaysList && displaysList.map(display => <option value={display.key} key={`displayOption/${display.key}`}>{display.name}</option>)}
                    </select>
                    <button onClick={()=>{addSelected(`${cardPath}/displays`, displaySelectorInput, "displayKey")}}>Add Display</button>
                    <button onClick={()=>{toggleDisplayAlignment()}}>Aligned {configuration?.displays?.alignment ? `Horizontally` : `Vertically`}</button>
                </>
            }
            />
    )

}

export default ScreensPage;