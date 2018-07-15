import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import * as TetherComponent from 'react-tether';
import {BOOKMARK_ADD_PLOT, BOOKMARK_REMOVE_PLOT, BookmarkAction} from '../../actions/bookmark';
import {ActionHandler} from '../../actions/redux-action';
import {Bookmark} from '../../models/bookmark';
import {ResultPlot} from '../../models/result';
import * as styles from './bookmarkbutton.scss';



export interface BookmarkProps extends ActionHandler<BookmarkAction> {
  bookmark: Bookmark;
  plot: ResultPlot;
}

export interface BookmarkButtonState {
  openDialog: boolean;
}

export class BookmarkButtonBase extends React.PureComponent<BookmarkProps, BookmarkButtonState> {
  constructor(props: BookmarkProps) {
    super(props);

    this.state = {
      openDialog: false
    };

    this.onBookmarkRemove = this.onBookmarkRemove.bind(this);
    this.onBookmarkAdd = this.onBookmarkAdd.bind(this);
    this.onBookmarkClick = this.onBookmarkClick.bind(this);
    this.onKeepBookmark = this.onKeepBookmark.bind(this);
  }

  public render() {
    const styleName = (this.isBookmarked()) ? 'bookmark-command-selected' : 'command';

    return (
      <TetherComponent
          attachment="top right"
          targetAttachment="bottom left"
      >
        <i
          title='书签'
          className="fa fa-bookmark"
          styleName={styleName}
          onClick={this.onBookmarkClick}
        />

        {
          this.state.openDialog &&
          <div styleName='bookmark-alert'>
            <div>删除书签？</div>
            <small>笔记将一并删除。</small>
            <div>
              <a onClick={this.onBookmarkRemove}>
                <i className="fa fa-trash-o">&nbsp;&nbsp;删除&nbsp;&nbsp;</i>
              </a>
              <a onClick={this.onKeepBookmark}>
                <i className="fa fa-bookmark">&nbsp;&nbsp;保留&nbsp;&nbsp;</i>
              </a>
            </div>
          </div>
        }
      </TetherComponent>
    );
  }

  private onKeepBookmark() {
    this.setState({openDialog: false});
  }

  private isBookmarked() {
    const {bookmark, plot} = this.props;
    return !!bookmark.dict[JSON.stringify(plot.spec)];
  }

  private onBookmarkClick() {
    if (this.isBookmarked()) {
      this.setState({openDialog: !this.state.openDialog});
    } else {
      this.onBookmarkAdd();
    }
  }

  private onBookmarkRemove() {
    this.setState({openDialog: false});
    this.props.handleAction({
      type: BOOKMARK_REMOVE_PLOT,
      payload: {
        spec: this.props.plot.spec
      }
    });
  }

  private onBookmarkAdd() {
    this.props.handleAction({
      type: BOOKMARK_ADD_PLOT,
      payload: {
        plot: this.props.plot
      }
    });
  }
}

export const BookmarkButton = CSSModules(BookmarkButtonBase, styles);
