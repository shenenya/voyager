
import * as React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {connect} from 'react-redux';
import {ClipLoader} from 'react-spinners';
import * as SplitPane from 'react-split-pane';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {SPINNER_COLOR} from '../../constants';
import {VoyagerConfig} from '../../models/config';
import {Dataset} from '../../models/dataset';
import {State} from '../../models/index';
import {selectConfig} from '../../selectors';
import {selectDataset} from '../../selectors/dataset';
import '../app.scss';
import {BookmarkPane} from '../bookmark-pane/index';
import {DashboardPane} from '../dashboard-pane/index';
import {DataPane} from '../data-pane/index';
import {DatasetPane} from '../dataset-pane/index';
import {EncodingPane} from '../encoding-pane/index';
import {Footer} from '../footer/index';
import {Header} from '../header/index';
import {LoadData} from '../load-data-pane/index';
import {LogPane} from '../log-pane/index';
import {ViewPane} from '../view-pane/index';
import * as styles from './app-root.scss';

export interface AppRootProps {
  dataset: Dataset;
  config: VoyagerConfig;
}

export interface AppRootState {
  width: number;
}

class AppRootBase extends React.PureComponent<AppRootProps, AppRootState> {
  constructor(props: AppRootProps) {
    super(props);
    this.state = {
      width: 100,
    };

    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const {dataset, config} = this.props;
    const {hideHeader, hideFooter} = config;
    let bottomPane, footer;
    if (!dataset.isLoading) {
      if (!dataset.data) {
        bottomPane = <LoadData/>;
      } else {
        bottomPane = (
          <SplitPane split="vertical" defaultSize={200} minSize={175} maxSize={350}>
            <DataPane/>
            <Tabs className={styles['react-tabs']}>
              <TabList className={styles['tab-list']}>
                <Tab className={styles.tab}>数据</Tab>
                <Tab className={styles.tab}>分析</Tab>
                <Tab className={styles.tab}>面板</Tab>
              </TabList>

              <TabPanel className={styles['tab-panel']}>
                <DatasetPane/>
              </TabPanel>
              <TabPanel className={styles['tab-panel']}>
                <SplitPane split="vertical" defaultSize={235} minSize={200} maxSize={350}>
                  <EncodingPane/>
                  <ViewPane/>
                </SplitPane>
              </TabPanel>
              <TabPanel className={styles['tab-panel']}>
                <SplitPane split="vertical" defaultSize={235} minSize={20} maxSize={350} onChange={this.onChange}>
                  <BookmarkPane width={this.state.width - 100}/>
                  <DashboardPane/>
                </SplitPane>
              </TabPanel>
            </Tabs>
          </SplitPane>
        );
        if (!hideFooter) {
          footer = <Footer/>;
        }
      }
    }
    return (
      <div className="voyager">
        <LogPane/>
        {!hideHeader && <Header/>}
        <ClipLoader color={SPINNER_COLOR} loading={dataset.isLoading}/>
        {bottomPane}
        {footer}
      </div>
    );
  }

  private onChange(width: any){
    console.log('width', width);
    this.setState({ width : width });
  }
}

export const AppRoot = connect(
  (state: State) => {
    return {
      dataset: selectDataset(state),
      config: selectConfig(state)
    };
  }
)(DragDropContext(HTML5Backend)(AppRootBase));

