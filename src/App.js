import React from "react";

class Control extends React.Component{
  render(){
    return(
      <div>
        <ul>
          <li>
            <a href = "/create" onClick={function(e){
              e.preventDefault();
              this.props.onChangeMode('create');
            }.bind(this)}>create</a>
          </li>
          <li>
            <a href = "/update"onClick={function(e){
              e.preventDefault();
              this.props.onChangeMode('update');
            }.bind(this)}>update</a>
          </li>
          <li>
            <input type="button" value="delete"onClick={function(e){
              e.preventDefault();
              this.props.onChangeMode('delete');
            }.bind(this)}></input>
          </li>
        </ul>
      </div>
    );
  }
}

class Subject extends React.Component{
  render(){
    return(
      <div>
        <h1>
            <a
              href="/"
              onClick={function(e){
                e.preventDefault();
                this.props.onChangePage();
              }.bind(this)}
            >
              {this.props.title}
            </a>
        </h1>
        <h2>{this.props.desc}</h2>
      </div>

    );
  }
}

class TOC extends React.Component{
  shouldComponentUpdate(newProps){
    if(this.props.data===newProps.data) return false;
    else return true;
  }
  render(){
    var lists = [];
    var data=this.props.data;
    var i=0;
    while(i<data.length){
      lists.push(
        <li key={data[i].id}>
          <a
            href={"/content/"+data[i].id}
            data-id={data[i].id}
            onClick={function(e){
              e.preventDefault();
              this.props.onChangePage(e.target.dataset.id);
            }.bind(this)}
            >{data[i].title}
          </a>
        </li>
      );
      i++;
    }
    return(
      <nav>
        <ul>
          {lists}
        </ul>
      </nav>
    )
  }
}

class ReadContent extends React.Component{
  render(){
    return(
      <article>
        <h2>{this.props.title}</h2>
        {this.props.desc}
      </article>
    );
  }
}

class CreateContent extends React.Component{
  render(){
    return(
      <article>
        <h2>Create</h2>
        <form action="/create_process" mothod="post"
          onSubmit={function(e){
            e.preventDefault();
            this.props.onSubmit(
              e.target.title.value,
              e.target.desc.value
            );
          }.bind(this)}
        >
          <p>
            <input type="text" name="title" placeholder="title"/>
          </p>
          <p>
            <textarea name="desc" placeholder="description"/>
          </p>
          <p>
            <input type="submit"/>
          </p>
        </form>
      </article>
    );
  }
}

class UpdateContent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id:this.props.data.id,
      title:this.props.data.title,
      desc:this.props.data.desc
    }
  }
  render(){
    return(
      <article>
        <h2>Update</h2>
        <form action="/update_process" method="post"
        onSubmit={function(e){
          e.preventDefault();
          this.props.onSubmit(
            this.state.id,
            this.state.title,
            this.state.desc
          );
        }.bind(this)}
        >
          <input type="hidden" name="id" value={this.state.id}></input>
          <p>
            <input
              type="text"
              name="title"
              placeholder="title"
              value={this.state.title}
              onChange={function(e){
                this.setState({
                  [e.target.name]:e.target.value
                });
              }.bind(this)}
              >
              
            </input>
          </p>
          
          
          <p>
            <textarea name="desc" placeholder="description"
              value={this.state.desc}
              onChange={function(e){
                this.setState({
                  [e.target.name]:e.target.value
                })
              }.bind(this)}
            ></textarea>
          </p>
          <p>
            <input type="submit"></input>
          </p>
        </form>
      </article>
    );
  };
}
class App extends React.Component{
  constructor(props){
    super(props);
    this.max_content_id=3;
    this.state={
      mode:'welcome',
      subject:{title:'WEB',sub:'World Wid Web'},
      selected_content_id:2,
      welcome:{title:'Welcome',desc:'Hello, React'},
      contents:[
        {id:1,title:'HTML',desc:'HTML is for information'},
        {id:2,title:'CSS',desc:'CSS is for design'},
        {id:3,title:'JavaScript',desc:'JavaScript is for interactive'}
      ]
    }
  }
  getReadContent(){
    var i=0;
    while(i<this.state.contents.length){
      var data=this.state.contents[i];
      if(data.id===this.state.selected_content_id){
        return data;
        break;
      }
      i++;
    }
  }
  render(){
    var _title,_desc,_article=null;
    if(this.state.mode === 'welcome'){
      _title=this.state.welcome.title;
      _desc=this.state.welcome.desc;
      _article=<ReadContent title={_title} desc={_desc}/>
    }else if(this.state.mode === 'read'){
      var _data=this.getReadContent();
      _article = <ReadContent title={_data._title} desc={_data._desc}/>
    }else if(this.state.mode==='create'){
      _article=<CreateContent onSubmit={function(_title,_desc){
        this.max_content_id++;
        var _contents=this.state.contents.concat(
          {id:this.max_content_id,title:_title,desc:_desc}
        )
        this.setState({
          contents:_contents
        });
      }.bind(this)}/>
    }else if(this.state.mode==='update'){
      var _contents=this.getReadContent();
      _article=<UpdateContent 
          data={_contents}
          onSubmit={function(_id,_title,_desc){
            var _content=Array.from(this.state.contents);
            var i=0;
            while(i<_content.length){
              if(_content[i].id===_id){
                _content[i]={id:_id,title:_title,desc:_desc};
                break;
              }
              i++;
            }
            this.setState({
              contents:_content,
              mode:'read'
            })
          }.bind(this)}
        />
    }
    return(
      <>
        <Subject
          title={this.state.subject.title}
          desc={this.state.subject.sub}
          onChangePage={function(){
              this.setState({mode:'welcome'});
          }.bind(this)}>
        </Subject>


        <TOC
          data={this.state.contents}
          onChangePage={function(id){
            this.setState({
              mode:'read',
              selected_content_id:Number(id),
            });
          }.bind(this)}>
        </TOC>

        <Control
          onChangeMode ={function(_mode){
            this.setState({
              mode:_mode
            });
          }.bind(this)}></Control>
        {_article}
      </>
    );
  }
}

export default App;