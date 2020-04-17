import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faFile,
  faTrash,
  faBook,
  faStar,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import {
  ContextMenu,
  MenuItem as ContexMenuItem,
  ContextMenuTrigger
} from 'react-contextmenu';
import { MainMenuStyle, MenuHeading, MenuItemRightFloat, MainMenuBottom, Spinner, MenuItemRowItem } from './style';
import MenuItem from './MenuItem';

import ModalForm from '../util/ModalForm';
import Finder from '../util/Finder';
import TreeMenuCont from '../../containers/TreeMenuCont/TreeMenuCont';
import { Spin } from 'antd';
import { GlobalHotKeys } from 'react-hotkeys';

export default function MainMenu({
  notebooks,
  selectNotebook,
  selectedNotebook,
  modals,
  createNotebook,
  softDeleteNote,
  updateNote,
  selectNoteAction,
  emptyTrash,
  tags,
  notesSync,
  spinner,
  showFinderModal,
  hideFinderModal,
  showNotebookModal,
  hideNotebookModal,
  searchNotesGlobal
}) {

  const keyMap = {
    FIND_ANYTHING: 'ctrl+g'
  };
  const handlers = {
    FIND_ANYTHING: event => {
      console.log("modals.finderModalToggle ", modals.finderModalToggle)
      if (modals.finderModalToggle) {
        hideFinderModal()
      } else {
        showFinderModal()
      }
    }
  };

  const mainMenuContextHandlers = {
    cmCreateNotebookInside: (e, {note}) => createNotebook(note._id),
    cmShowInMenuHandler: (e, {note}) => updateNote(note._id, {showInMenu: !note.showInMenu, kind: "collection" }),
    cmDeleteNoteHandler: (e, {note}) => softDeleteNote(note._id),
    cmOpenInEditor: (e, {note}) => selectNoteAction(note._id)
  };
  const contextEmptyTrash = (e, data) => {
    emptyTrash()
  };

  const contextCreateNewNotebook = (e, data) => {
    showNotebookModal(data);
  };

  const newNotebookSubmitAction = (data, additional) => {
    hideNotebookModal();
    console.log('newNotebookSubmitAction', data);
    createNotebook("root", { title: data.value, ...additional });
  };

  const finderSearchResultSelect = (noteId) => {
    hideNotebookModal();
    selectNoteAction(noteId)
    console.log('finderSearchResultSelect', noteId);
  };
  return (
    <MainMenuStyle className="noselect">
      {/* <p>{JSON.stringify(data, true, 2)}</p> */}

      <MenuItem
        label="All notes"
        icon={<FontAwesomeIcon icon={faBook} />}
        compKey="MenuItem"
        onClickHandler={e=> selectNotebook("ALL")}
        selected={selectedNotebook === "ALL"}

      />


      <ContextMenuTrigger id="trash_trigger">
        <MenuItem
          label="Trash"
          icon={<FontAwesomeIcon icon={faTrash} />}
          compKey="trashMenuItem"
          onClickHandler={e=> selectNotebook("TRASH")}
          selected={selectedNotebook === "TRASH"}
        />
      </ContextMenuTrigger>
      <MenuItem
        label="Favourites"
        icon={<FontAwesomeIcon icon={faStar} />}
        compKey="favMenuItem"
        onClickHandler={e=> selectNotebook("FAV")}
        selected={selectedNotebook === "FAV"}
      />
      {/* <TreeMenu items={data && data.results}/> */}
      <ContextMenuTrigger id="mainmenu_notebooks">
        <MenuItem
          label={<MenuHeading>Notebooks</MenuHeading>}
          skipIcon={true}
          right={
            <MenuItemRightFloat>
              <FontAwesomeIcon
                onClick={e => contextCreateNewNotebook(e, null)}
                icon={faPlusCircle}
              />
            </MenuItemRightFloat>
          }
          compKey="Notebooks"
        />
      </ContextMenuTrigger>

      {notebooks.map(n => (
        <TreeMenuCont
          note={n}
          key={`treemenu${n._id}`}
          selectNotebook={selectNotebook}
          handlers={mainMenuContextHandlers}
        />
      ))}

      <MenuItem
          label={<MenuHeading>Tags</MenuHeading>}
          icon={ <FontAwesomeIcon
            icon={faTag}
          />}
          compKey="tagsHeading"
        />
      {tags.map(n => (
        <MenuItem
        label={n}
        // icon={ <FontAwesomeIcon
        //   icon={faTag}
        // />}
        onClickHandler={e=> selectNotebook("tag::" +  n)}
        selected={selectedNotebook === "tag::" +  n}
        compKey={`tag-menu-item-${n}`}
        key={`tag-menu-item-${n}`}
      />
      ))}
<MainMenuBottom>
  <MenuItemRowItem style={{padding: '0px 6px 0px 0px '}}>

        {spinner && <Spin size="small" ></Spin>}
  </MenuItemRowItem>
  <MenuItemRowItem>
         {notesSync}
  </MenuItemRowItem>
  {/* {notesSync === "success" && "Sync Completed"}
  {notesSync === "pending" && "Synchronising..."}
  {notesSync === "error" && "Sync error"} */}

</MainMenuBottom>
      {/* <FlatMenu
        items={notebooks}
        selectNotebook={selectNotebook}
        selectedNotebook={selectedNotebook}
      /> */}
      <ContextMenu id="mainmenu_notebooks">
        <ContexMenuItem
          data={{ foo: 'bar' }}
          onClick={contextCreateNewNotebook}
        >
          New Notebook
        </ContexMenuItem>
      </ContextMenu>
      <ContextMenu id="trash_trigger">
        <ContexMenuItem
          data={{ foo: 'bar' }}
          onClick={contextEmptyTrash}
          style={{backgroundColor: 'red', color: 'white'}}
        >
          Empty Trash
        </ContexMenuItem>
      </ContextMenu>

      <ModalForm
        visible={modals.showNotebookModalToggle}
        title="Create Notebook"
        data={modals.showNotebookData}
        placeholder="Notebook title"
        formSubmitHandler={newNotebookSubmitAction}
        initialValue=""
        handleCancel={e => hideNotebookModal()}
      />
      <Finder
        visible={modals.finderModalToggle}
        title="Find anything"
        data={modals.finderModalData}
        search={searchNotesGlobal}
        placeholder="Search note titles, contents and tags"
        onSearchResultSelect={finderSearchResultSelect}
        initialValue=""
        handleCancel={e => hideFinderModal()}
      />


    <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
    </MainMenuStyle>
  );
}
