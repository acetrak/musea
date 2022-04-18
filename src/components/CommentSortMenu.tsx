import * as React from 'react';
import { useState, memo } from 'react';
import {
  CardActionArea,
  ClickAwayListener,
  Grow, MenuItem, MenuList,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';

export const SORT_VALUE = {
  HOT: 'HOT' as 'HOT',
  LATEST: 'LATEST' as 'LATEST'
};

export const COMMENT_SORT = [
  {
    label: '热门评论',
    value: SORT_VALUE.HOT,
    alis: 2
  },
  {
    label: '最新评论',
    value: SORT_VALUE.LATEST,
    alis: 3
  }
];

type CommentSortMenuProps = {
  onItemClick: (sort: string) => void,
  sort: 'HOT' | 'LATEST'
}

function CommentSortMenu(props: CommentSortMenuProps) {

  const { onItemClick, sort } = props;
  const [open, setOpen] = useState(false);
  const [openTip, setTipOpen] = React.useState(false);

  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => {
      // setTipOpen(prevOpen);
      return !prevOpen;
    });
    setTipOpen(false);
  };

  const handleClose = (event: any) => {
    // @ts-ignore
    if (anchorRef.current && anchorRef.current?.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current && !open) {
      // @ts-ignore
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);


  const handleTipClose = () => {
    setTipOpen(false);
  };

  const handleTipOpen = () => {
    if (!open)
      setTipOpen(true);
  };

  const handleItemClick = (e: any, sort: string) => {
    onItemClick(sort);
    handleClose(e);
  };

  return (
    <>

      <CardActionArea
        onClick={handleToggle}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{ userSelect: 'none', display: 'inline-block', width: 'unset' }}
      >
        <Tooltip
          title="为评论排序"
          open={openTip}
          onClose={handleTipClose}
          onOpen={handleTipOpen}
        >
          <Stack flexDirection="row" alignItems="center" sx={{ p: 0.4 }}>
            <SortOutlinedIcon />
            <Typography variant="body1" pl={0.5}>排序方式</Typography>
          </Stack>
        </Tooltip>

      </CardActionArea>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ position: 'relative', zIndex: 1500 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {
                    COMMENT_SORT.map(item => (
                      <MenuItem
                        key={item.value}
                        selected={sort === item.value}
                        onClick={(e) => handleItemClick(e, item.value)}
                      >
                        {item.label}
                      </MenuItem>
                    ))
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default memo(CommentSortMenu);