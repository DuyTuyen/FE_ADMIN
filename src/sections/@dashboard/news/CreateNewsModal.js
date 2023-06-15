import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

CreateNewsModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateNews: PropTypes.func,
};

function CreateNewsModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateNews(e) {
    e.preventDefault();
  
    if (onSubmit){
      const createNews = {
        title,
        content
      }
      onSubmit(createNews);
    }
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo bài viết</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_NEWS ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateNews(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên bài viết</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập nội dung" />
          </Form.Group>
         
          <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <CKEditor
                  editor={ ClassicEditor }
                  data={content}
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      console.log( { event, editor, data } );
                      setContent(data);
                  } }
              />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Tạo
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateNewsModal;
