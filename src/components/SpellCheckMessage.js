// @flow
import React from 'react';

import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';

import Card from './Card';
import Searcher from './Searcher';

type SpellCheckMessageProps = {
  location: any;
  history: any;
};

/**
 * A suggested alternate query if one is available.
 */
class SpellCheckMessage extends React.Component<SpellCheckMessageProps> {
  static contextTypes = {
    searcher: typeof Searcher,
  };

  static displayName = 'SpellCheckMessage';

  constructor(props: SpellCheckMessageProps) {
    super(props);
    (this: any).handleClick = this.handleClick.bind(this);
  }

  getMessage(): string {
    const searcher = this.context.searcher;
    if (searcher) {
      const response = searcher.state.response;
      if (response && response.totalHits === 0) {
        if (response.feedback) {
          const spellCheckMessages = response.feedback.filter((feedback): boolean => {
            return feedback.messageName === 'spellcheck.suggested';
          });
          return spellCheckMessages[0] ? spellCheckMessages[0].message : '';
        }
      }
    }
    return '';
  }

  getLink() {
    const message = this.getMessage();
    if (message) {
      return (
        <a
          onClick={this.handleClick}
          role="button"
          tabIndex={0}
        >
          {message}
        </a>
      );
    }
    return null;
  }

  handleClick() {
    const message = this.getMessage();
    const path = '/results';
    const searchString = QueryString.parse(this.props.location.search);
    searchString.query = message;
    this.props.history.push({
      pathname: path,
      search: QueryString.stringify(searchString),
    });
  }

  render() {
    const link = this.getLink();
    if (link) {
      return (
        <Card borderless style={{ paddingLeft: '20%', fontSize: '2rem' }}>
          {'Your search returned no results.'}
          <br />
          {'Did you mean \u201c'}
          {link}
          {'\u201d?'}
        </Card>
      );
    }
    return null;
  }
}

export default withRouter(SpellCheckMessage);
