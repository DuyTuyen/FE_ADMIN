import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import Page from '../../../enums/page';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Loading from 'src/components/loading/Loading';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import axios from 'axios';
import { imageAPI } from 'src/api/ConfigAPI';

UpdateTechnovaServiceModal.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  activeTechnovaService: PropTypes.object,
};

function UpdateTechnovaServiceModal(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token.value)

  const {errorMessage, page} = useSelector((state) => state.error.value);
  const { isShow, onClose, onSubmit, activeTechnovaService } = props;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWait, setIsWait] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [description, setDescription] = useState('');


  function handleClose() {
    if (onClose) onClose();
  }

  useEffect(() => {
    if(!activeTechnovaService){
      return;
    }

    setTitle(activeTechnovaService.title)
    setContent(activeTechnovaService.content)
    setDescription(activeTechnovaService.description)
    setImageId(activeTechnovaService.image?.id);
    setImagePath(activeTechnovaService.image?.path);

  },[activeTechnovaService])

  function handleUpdateTechnovaService(e) {
    e.preventDefault();

    if(isWait){
      window.alert('Vui lòng chờ hình ảnh được tải lên');
      return;
    }

    if (onSubmit){
      const updateTechnovaService = {
        title,
        content,
        description,
        imageId
      }
      onSubmit(updateTechnovaService);
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
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_TECHNOVA_SERVICE}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_TECHNOVA_SERVICE}));
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
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_TECHNOVA_SERVICE}));
      else 
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_TECHNOVA_SERVICE}));
    }
  }

  return (
    <Modal style={{ zIndex: 9999 }} show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật</Modal.Title>
      </Modal.Header>
      {errorMessage !== '' && errorMessage && page === Page.UPDATE_TECHNOVA_SERVICE ? (
        errorMessage.split('---').map((err, index) => (
          <Alert key={index} severity="error">
            {err}
          </Alert>
        ))
      ) : (
        <></>
      )}
      <Form onSubmit={handleUpdateTechnovaService}>
        <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Tiêu đề dịch vụ</Form.Label>
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

          <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <textarea value={description} onChange={(e) => {setDescription(e.target.value)}} name="w3review" rows="4" cols="50" />
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
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateTechnovaServiceModal;
