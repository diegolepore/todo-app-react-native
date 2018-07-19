//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// create a component
class Footer extends Component {
    render() {
        const { filter, onFilter, onClearComplete } = this.props;
        return (
            <View style={styles.container}>
            {/*    <View style={styles.filters}>
                    <TouchableOpacity style={[styles.filter, filter === "ALL" && styles.selected]} onPress={() => onFilter("ALL")}>
                        <Text>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, filter === "ACTIVE" && styles.selected]} onPress={() => onFilter("ACTIVE")}>
                        <Text>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, filter === "COMPLETED" && styles.selected]} onPress={() => onFilter("COMPLETED")}>
                        <Text>Completed</Text>
                    </TouchableOpacity>
        </View> */}
                <TouchableOpacity onPress={onClearComplete}>
                    <Text>Clear Completed</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    filters: {
      flexDirection: "row"
    },
    filter: {
      padding: 8,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "transparent"
    },
    selected: {
      borderColor: "rgba(175, 47, 47, .2)"
    }
})

//make this component available to the app
export default Footer;
