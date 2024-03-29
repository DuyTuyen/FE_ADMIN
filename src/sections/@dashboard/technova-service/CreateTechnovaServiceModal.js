import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import {  useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { imageAPI } from 'src/api/ConfigAPI';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import Loading from 'src/components/loading/Loading';

CreateTechnovaServiceModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateTechnovaService: PropTypes.func,
};

function CreateTechnovaServiceModal(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token.value)

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit } = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWait, setIsWait] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [description, setDescription] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  function handleCreateTechnovaService(e) {
    e.preventDefault();

    if(isWait){
      window.alert('Vui lòng chờ hình ảnh được tải lên');
      return;
    }

    if (onSubmit){
      const createTechnovaService = {
        title,
        content,
        description,
        imageId
      }
      onSubmit(createTechnovaService);
      setTitle('')
      setContent('')
      setImageId(null)
      setImagePath(null)
      setDescription('')
    }
  }

  async function handleUploadImage(file){
    try {
      setIsWait(true)    
      const formData = new FormData();
      formData.append('files', file.target.files[0])
      const res = await imageAPI.create(formData, token);
      const data = res.data;
      setImageId(data[0].id);
      setImagePath(data[0].path);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_TECHNOVA_SERVICE}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_TECHNOVA_SERVICE}));
    } finally{
      setIsWait(false);
    }
  }

  async function handleDeleteImage(e){
    try {
      if(!imageId){
        return
      }
      await imageAPI.delete(imageId, token);
      e.target.value = null;
      setImageId(null);
      setImagePath(null);
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_TECHNOVA_SERVICE}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_TECHNOVA_SERVICE}));
    }
  }

  return (
    <Modal style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dịch vụ</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.CREATE_TECHNOVA_SERVICE ? (
          <Alert severity="error">
            {errorMessage}
          </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={(e) => handleCreateTechnovaService(e)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề dịch vụ</Form.Label>
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

          <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Hình ảnh
              {
                 isWait ? 
                 <Loading></Loading>: 
                 imageId ? <Image  height="100" width="100" style={{marginTop: '10px'}}src={imagePath} alt="brand-image" />: <></>
              }
              </Form.Label>
            <Form.Control accept="image/*" type="file" min="1" placeholder="Chọn hình ảnh"  onChange={(e) => handleUploadImage(e)} onClick={(e) => handleDeleteImage(e)}/>
            <Form.Control type="hidden" value={imageId}/>
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

export default CreateTechnovaServiceModal;
