import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import {  useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

CreateAboutCompanyModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateAboutCompany: PropTypes.func,
};

function CreateAboutCompanyModal(props) {

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateAboutCompany(e) {
    e.preventDefault();
  
    if (onSubmit){
      const createAboutCompany = {
        title,
        content
      }
      onSubmit(createAboutCompany);
    }
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo bài viết</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_ABOUT_COMPANY ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateAboutCompany(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
          <Form.Label>Tên bài giới thiệu</Form.Label>
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

export default CreateAboutCompanyModal;
