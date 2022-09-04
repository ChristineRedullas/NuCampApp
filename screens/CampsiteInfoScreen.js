import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import { Rating, Input } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite.js';
import { toggleFavorite } from '../features/favorites/favoritesSlice.js';
import { postComment } from '../features/comments/commentsSlice.js';

const CampsiteInfoScreen = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const[author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch(postComment);
    


    const handleSumbit = () => {
        const newComment = {
            campsiteId: campsite.id,
            author,
            rating,
            text
        };
        console.log(newComment);
        dispatch(postComment(newComment))
    };

    const resetForm = () => {
        setRating(5);
        setAuthor('');
        setText('');
    };

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating 
                    startingValue={item.rating}
                    imageSize={10}
                    style={{
                        alignItems : 'flex-start',
                        paddingVertical : '5%'
                    }}
                    readonly
                />
                <Text style={{ fontSize: 12 }}>
                    {`--${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <>
        <FlatList
            data={comments.commentsArray.filter(
                (comment) => comment.campsiteId === campsite.id
            )}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                marginHorizontal: 20,
                paddingVertical: 20
            }}
            ListHeaderComponent={
                <>
                    <RenderCampsite
                        onShowModal={() => setShowModal(!showModal)}
                        campsite={campsite}
                        isFavorite={favorites.includes(campsite.id)}
                        markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                    />
                    <Text style={styles.commentsTitle}>Comments</Text>
                </>
            }
        />
        <Modal 
            animationType='slide'
            transparent={false}
            visible={showModal}
            onRequestClose={() => setShowModal(!showModal)}>
            <View style={styles.modal}>
                <Rating 
                    showRating={true}
                    startingValue={5} 
                    imageSize={40}
                    onFinishRating={(rating) => setRating(rating)} 
                    style={{ paddingVertical: 10 }}
                />
                <Input 
                    placeholder='Author' 
                    leftIcon={{name: 'user-o', type:'font-awesome', color: '#FF0000'}} 
                    leftIconContainerStyle={{ paddingRight: 10 }} 
                    onChangeText={(rating) => setAuthor(rating)} 
                    value={author} 
                />
                <Input 
                    placeholder='Comment'
                    leftIcon={{name: 'comment-o', type:'font-awesome', color: '#FF0000'}} 
                    leftIconContainerStyle={{ paddingRight: 10 }} 
                    onChangeText={(comment) => setText(comment)} 
                    value={text} 
                />
                <View style={{ margin: 10 }}>
                    <Button 
                        title="Submit" 
                        color="#3960a1" 
                        onPress={() => {
                            handleSumbit();
                            resetForm();
                        }} 
                    />
                </View>
                <View style={{ margin: 10 }}>
                <Button 
                    onPress={() => {
                        setShowModal(!showModal); 
                        resetForm();
                    }} 
                    color="#808080" 
                    title="cancel"
                />
               </View>
            </View>
        </Modal>
        </>
    );
};


const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default CampsiteInfoScreen;