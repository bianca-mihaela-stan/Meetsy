import React from 'react';
import { bool, func, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    activeBar: {
        height: 56,
        width: 3,
        backgroundColor: '#DDE2FF',
        position: 'absolute',
        left: 0
    },
    activeTitle: {
        color: '#DDE2FF'
    },
    container: {
        cursor: 'pointer',
        flexDirection: 'column',
        paddingTop: '15%',
        paddingBottom: '80px',
        
    },
    title: {
        fontSize: 16,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#A4A6B3',
        textDecoration: 'none'
    },
    imageCtn : {
      borderRadius: '50%',
      width: '47px',
      height: '47px',
      overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: 'auto'
    }
});

function ProfileImage(props){
    const {path, content,title,...otherProps} = props;
    const Content = content;
    const Path = path;
    return (
        <Row className={css(styles.container)} vertical="center">
        <Link to={Path} className={css(styles.imageCtn)}><img className={css(styles.image)} src={Content}/></Link>

        </Row>
    );
}

ProfileImage.propTypes = {
    icon: func,
    title: string
};

export default ProfileImage;