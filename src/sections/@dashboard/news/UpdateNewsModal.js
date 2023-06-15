import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

UpdateNewsModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeNews: PropTypes.object,
};

function UpdateNewsModal(props) {
  const dispatch = useDispatch();

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeNews } = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    setTitle(activeNews?.title)
    setContent(activeNews?.content)
  },[activeNews])

  function handleUpdateNews(e) {
    e.preventDefault();
  
    if (onSubmit){
      const updateNews = {
        title,
        content
      }
      onSubmit(updateNews);
    }
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_NEWS ? (
        errorMessage.split('---').map((err, index) => (
          <Alert key={index} severity="error">
            {err}
          </Alert>
        ))
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateNews}>
        <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Tên bài viết</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập nội dung" />
          </Form.Group>
         
          <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <CKEditor
                  editor={ ClassicEditor}
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
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateNewsModal;
