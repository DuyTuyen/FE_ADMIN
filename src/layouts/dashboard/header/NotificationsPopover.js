import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fDate, fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import axios from 'axios';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import Loading from 'src/components/loading/Loading';
import { notificationAPI } from 'src/api/ConfigAPI';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { loading } = useSelector(state => {
    return {
      loading: state.loading.value
    }
  })
  const [readNotifications, setReadNotifications] = useState([]);
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkRead = async (notification) => {
    dispatch(showLoading());
    try {
      const res = await notificationAPI.updateIsRead(notification._id);
      const tempReadNotifications = [...readNotifications, {...notification, isRead: true}]
      const tempUnReadNotifications = unReadNotifications.filter(n => n._id !== notification._id)
      setReadNotifications(tempReadNotifications);
      setUnReadNotifications(tempUnReadNotifications)
    } catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
      else dispatch(setErrorValue(error.toString()));
      navigate("/error")
    } finally {
      dispatch(closeLoading());
    }
  }

  const handleMarkAllAsRead = async () => {
    await Promise.all(unReadNotifications.map(n => handleMarkRead(n)))
  };

  useEffect(() => {
    async function getNotifications() {
      dispatch(showLoading());
      try {
        const res = await notificationAPI.getAll();
        setReadNotifications(res.data.filter(i => i.isRead));
        setUnReadNotifications(res.data.filter(i => !i.isRead));
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
      } finally {
        dispatch(closeLoading());
      }
    }
    getNotifications();
  }, [])
  
   return (
    loading ?
      <Loading /> :
      <>
        <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={unReadNotifications?.length} color="error">
            <Iconify icon="eva:bell-fill" />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              ml: 0.75,
              width: 360,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Thông báo</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Bạn có {unReadNotifications?.length} thông báo chưa đọc
              </Typography>
            </Box>

            {unReadNotifications.length > 0 && (
              <Tooltip title="Đánh dấu tất cả đã đọc">
                <IconButton color="primary" onClick={handleMarkAllAsRead}>
                  <Iconify icon="eva:done-all-fill" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  Chưa đọc
                </ListSubheader>
              }
            >
              {unReadNotifications.map((notification) => (
                <NotificationItem handleMarkRead={handleMarkRead} key={notification.id} notification={notification} />
              ))}
            </List>

            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  Đã đọc
                </ListSubheader>
              }
            >
              {readNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </List>
          </Scrollbar>

          <Divider sx={{ borderStyle: 'dashed' }} />
        </Popover>
      </>
  );
}

// ----------------------------------------------------------------------


function NotificationItem({handleMarkRead, notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      onClick={() => { handleMarkRead(notification) }}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification?.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification?.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {"Cảnh báo lô hàng"}
      <Typography component="div" variant="body2" sx={{ color: 'text.secondary' }}>
        {`Lô hàng ${notification?.r_consignment.r_productDetail.r_product.name} ${notification?.r_consignment.r_productDetail.color} nhập ngày ${fDate(notification?.r_consignment.importedAt)} sắp hết,(còn ${notification?.r_consignment.quantity} sản phẩm) hãy chú ý kiếm tra kho hàng của bạn`}
      </Typography>
    </Typography>
  );

  return {
    avatar: <img src="/assets/icons/ic_notification_chat.svg" />,
    title,
  };
}
