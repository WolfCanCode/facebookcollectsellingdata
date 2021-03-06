import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageStore
} from 'react-native';
import {
    Avatar,
    Button,
    Badge,
    Header,
    Icon,
    Card,
    SearchBar
} from 'react-native-elements'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

//img
const prodImg = require('../../assets/images/avtProd.png');
import SwipeList from 'react-native-smooth-swipe-list';
import {Font, Expo} from 'expo';
import ActionButton from 'react-native-action-button';
import {Actions} from 'react-native-router-flux';
import ListItemButton from '../../components/listItemButtonComponent'
import Modal from "react-native-modal";
import {Kaede} from 'react-native-textinput-effects';
import {ImagePicker} from 'expo';

const SCREEN_WIDTH = Dimensions
    .get('window')
    .width;
const myUrl = 'http://52.41.8.125'

export default class ClientScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            isVisible: true,
            modalVisible: false,
            imgProduct: prodImg,
            codeProduct: '',
            nameProduct: '',
            priceProduct: 0,
            okModal: false,
            isAdd: false,
            delOkModal: false,
            upOkModal: false,
            searchText: ''
        };

    }

    async componentDidMount()
    {
        await this.getData();
    }

    async getData(search) {
        if (!search) 
            search = '';
        await fetch(myUrl + '/client?where={"name":{"contains":"' + search + '"}}').then((res1) => res1.json()).then((res2) => {
            let list = res2;
            this.rowData = list.map((item, index) => {
                return {
                    id: index,
                    rowView: getRowView(item),
                    rightSubView: this.deleteButton(item.id), //optional
                    style: styles.row //optional but recommended to style your rows
                };
            });
            this.setState({rowData: this.rowData});
            this.setState({isVisible: false});
        });
    }

    _pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4]
        });

        if (!result.cancelled) {
            this.setState({imgProduct: result});
        }
    };

    _cancelModal = () => {
        if (!this.state.modalVisible == false) 
            this.setState({imgProduct: prodImg, codeProduct: '', nameProduct: '', priceProduct: 0, modalVisible: false});
        };
    

    _deleteClient = async(id) => {
        fetch(myUrl + '/client/' + id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res1) => res1.json()).then((res2) => {

            this.setState({delOkModal: true});
            this.getData();
        });

    }

    deleteButton(id) {
        return (<ListItemButton
            text="Xóa khách hàng"
            color="RED"
            onPress={() => this._deleteProduct(id)}/>);
    }

    render() {
        return (

            <View
                style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#212121'
            }}>
                <Header
                    placement="left"
                    outerContainerStyles={{
                    borderBottomWidth: 0,
                    paddingBottom: 10,
                    height: 70
                }}
                    backgroundColor="rgb(92,107,192)"
                    statusBarProps={{
                    barStyle: 'light-content'
                }}
                    leftComponent={< Icon type = 'entypo' name = 'chevron-thin-left' color = '#ffffff' onPress = {
                    function () {
                        Actions.pop();
                    }
                } />}
                    centerComponent={{
                    text: 'Khách hàng',
                    style: {
                        color: '#fff',
                        fontSize: 25
                    }
                }}
                    rightComponent={{}}/>

                <SearchBar
                    round
                    onChangeText={(event) => {
                    this.getData(event);
                }}
                    onClear={() => {
                    alert('hihi')
                }}
                    placeholder='Nhập từ khóa...'/>

                <ScrollView
                    style={{
                    flex: 1,
                    alignSelf: 'stretch'
                }}>
                    <SwipeList
                        rowData={this.state.rowData}
                        rowStyle={{
                        marginLeft: 5,
                        marginRight: 5,
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        alignSelf: 'stretch'
                    }}/>
                </ScrollView>
                <Modal isVisible={this.state.delOkModal} style={styles.bottomModal}>
                    <View style={styles.modalContent}>
                        <Text>Xóa thành công</Text>
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({delOkModal: false})
                        }}>
                            <View style={styles.button}>
                                <Text>OK</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>
                <OrientationLoadingOverlay
                    visible={this.state.isVisible}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Tải khách hàng... 😀😀😀"></OrientationLoadingOverlay>
            </View>
        );
    }
}

function getRowView(item) {
    return <View
        style={{
        flexDirection: 'row',
        flex: 1,
        marginTop: 15,
        marginBottom: 15
    }}>
        <Avatar
            medium
            rounded
            source={{
            uri: 'https://graph.facebook.com/' + item.fbId + '/picture?type=large'
        }}
            activeOpacity={0.7}
            style={{
            flex: 3
        }}/>
        <Text
            style={{
            color: 'white',
            fontSize: 20,
            flex: 5,
            marginLeft: 20
        }}>{item.name}</Text>
        <Badge
            value={'SĐT: ' + item.phone}
            textStyle={{
            color: 'yellow',
            fontSize: 20
        }}
            style={{
            flex: 5,
            alignItems: 'center'
        }}/>

    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white'
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    }
});
