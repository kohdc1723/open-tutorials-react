import { useState } from "react";

function Header(props) {
  return (
    <header>
      <h1><a href="/" onClick={(event) => {
        event.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}

function Nav(props) {
  const list = [];
  
  for (let i = 0; i < props.topics.length; ++i) {
    let t = props.topics[i];
    list.push(<li key={t.id}><a id={t.id} href={"/read/" + t.id} onClick={(event) => {
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{t.title}</a></li>);
  }

  return (
    <nav>
      <ol>
        {list}
      </ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      <p>{props.body}</p>
    </article>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create"/></p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" value={title} onChange={(event) => {
          setTitle(event.target.value);
        }}/></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={(event) => {
          setBody(event.target.value);
        }}></textarea></p>
        <p><input type="submit" value="Update"/></p>
      </form>
    </article>
  );
}

// App
function App() {
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id: 1, title: "HTML", body:"HTML is ..."},
    {id: 2, title: "CSS", body:"CSS is ..."},
    {id: 3, title: "JavaScript", body:"JavaScript is ..."}
  ]);

  let content = null;
  let contextControl = null;
  if (mode === "WELCOME") {
    content = <Article title="Welcome" body="Hello, React!"></Article>;
    contextControl = <>
      <ul>
        <li>
          <a href="/create" onClick={(event) => {
            event.preventDefault();
            setMode("CREATE");
          }}>Create</a>
        </li>
      </ul>
    </>;
  } else if (mode === "READ") {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; ++i) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = <>
      <ul>
        <li><a href={"/update/" + id} onClick={(event) => {
          event.preventDefault();
          setMode("UPDATE");
        }}>Update</a></li>
        <li><input type="button" value="Delete" onClick={() => {
          const newTopics = [];
          for (let i = 0; i < topics.length; ++i) {
            if (topics[i].id !== id) {
              newTopics.push(topics[i]);
            }
          }
          setTopics(newTopics);
          setMode("WELCOME");
        }}/></li>
      </ul>
    </>;
  } else if (mode === "CREATE") {
    content = <Create onCreate={(title, body) => {
      const newTopic = {
        id: nextId,
        title: title,
        body: body
      };
      const temp = [...topics];
      temp.push(newTopic);
      setTopics(temp);
      setMode("READ");
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if (mode === "UPDATE") {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; ++i) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const updatedTopic = {
        id: id,
        title: title,
        body: body
      };
      const temp = [...topics];
      for (let i = 0; i < temp.length; ++i) {
        if (temp[i].id === id) {
          temp[i] = updatedTopic;
          break;
        }
      }
      setTopics(temp);
      setMode("READ");
    }}></Update>
  }

  return (
    <div>
      <Header title="React" onChangeMode={() => {
        setMode("WELCOME");
      }}></Header>

      <Nav topics={topics} onChangeMode={(id) => {
        setMode("READ");
        setId(id);
      }}></Nav>

      {content}

      {contextControl}
    </div>
  );
}

export default App;
