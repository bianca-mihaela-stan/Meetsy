import React from 'react';
import { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import { StyledInput, StyledButton } from '../../styles';

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileUrl: null,
      progress: 0
    }
  }

  onFileChange = event => {
    if (event.target.files[0]) {
      this.setState({ selectedFile: event.target.files[0] })
    }
  }

  onUploadFile = () => {
    const uploadTask = this.props.firebase.storage.ref(`images/${this.state.selectedFile.name}`).put(this.state.selectedFile);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: progress });
      },
      error => {
        console.log(error);
      },
      () => {
        this.props.firebase.storage
          .ref('images')
          .child(this.state.selectedFile.name)
          .getDownloadURL()
          .then(url => {
            this.setState({
              fileUrl: url
            });

            let id = this.props.firebase.authUser.uid;
            this.props.firebase.user(id).update({
              profileImage: url
            })
          });
      }
    )
  }

  render() {
    return (<AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Account: {this.props.firebase.authUser.username}</h1>
          <PasswordForgetForm />
         
          <StyledInput type="file" onChange={this.onFileChange} />
          <StyledButton onClick={this.onUploadFile}>Upload Profile Image</StyledButton>
          <br></br>
          <progress value={this.state.progress} max="100" />
        </div>
      )
      }
    </AuthUserContext.Consumer>
    )
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);