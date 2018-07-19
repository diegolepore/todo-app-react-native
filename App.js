import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ListView, Keyboard, ScrollView, AsyncStorage, ActivityIndicator} from 'react-native';
import Header from './Header'
import Footer from './Footer'
import Row from './Row'

const filterItems = (filter, items) => {
  return items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return item.complete;
    if (filter === "ACTIVE") return !item.complete;
  })
}

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      allComplete: false,
      value: "",
      filter: "ALL",
      items: [],
    }
    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this)
    this.handleToggleComplete = this.handleToggleComplete.bind(this)
    this.handleRemoveItem = this.handleRemoveItem.bind(this)
    // this.handleFilter = this.handleFilter.bind(this)
    this.handleClearComplete = this.handleClearComplete.bind(this)
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem("todoItems").then((json) => {
      try {
        const items = JSON.parse(json);
        this.setState({ 
          items: items ? items : [],
          loading: false, 
        });
      } catch(e) {
        this.setState({ 
          loading: false, 
        });
      } 
    })
  }

  handleUpdateText(key, text) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        text
      }
    })

    this.setState({
      items: newItems,
    })
  }
  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        editing: editing
      }
    })
    
    this.setState({
      items: newItems,
    })

    console.log('Editing', editing)
    console.log(this.state.items)
  }

  handleClearComplete() {
    const newItems = filterItems("ACTIVE", this.state.items);

    this.setState({
      items: newItems,
    })
    AsyncStorage.setItem("todoItems", JSON.stringify(newItems));
  }

  // handleFilter(filter) {
  //   this.setState({
  //     items: filterItems(filter, this.state.items),
  //     filter: filter,
  //   })
  // }

  handleAddItem() {
    if(!this.state.value) return 
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false,
        editing: false,
      }
    ]
    this.setState({
      items: newItems,
      value: "",
    })
    AsyncStorage.setItem("todoItems", JSON.stringify(newItems));

  }

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))

    this.setState({
      items: newItems,
      allComplete: complete
    })

    AsyncStorage.setItem("todoItems", JSON.stringify(newItems));
    
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if(item.key !== key ) return item;
      return {
        ...item,
        complete
      }
    })

    this.setState({
      items: newItems,
    })

    AsyncStorage.setItem("todoItems", JSON.stringify(newItems));

  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key !== key;
    })

    this.setState({
      items: newItems,
    })

    AsyncStorage.setItem("todoItems", JSON.stringify(newItems));

  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          value={this.state.value}
          onAddItem = {this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />

        {/* TODO: Use either FlatList or SectionList fr performance */}
        <ScrollView style={styles.list} onScroll={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            
            {this.state.items.map((item, key)=>{
              return (
                <Row
                  key={item.key}
                  {...item}
                  onComplete={(complete) => this.handleToggleComplete(item.key, complete)}
                  onRemove={() => this.handleRemoveItem(item.key)}
                  onUpdate={(text) => this.handleUpdateText(item.key, text)}
                  onToggleEdit={(editing) => this.handleToggleEditing(item.key, editing)}
                />
              )
            })}

          </View>
        </ScrollView>
        <Footer 
          onFilter={this.handleFilter}
          filter={this.state.filter}
          onClearComplete={this.handleClearComplete}
        />
        {this.state.loading && 
          <View style={styles.loading}>
            <ActivityIndicator
              animating
              size="large"
            />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: { paddingTop: 30, }
    })
  },
  content: {
    flex: 1,
  },
  list: {
    backgroundColor: '#fff',
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.2)",
  },
});
