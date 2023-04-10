import React from 'react';
import { connect } from 'react-redux';
import RiffDetail from './RiffDetail.js';

const size = 25; // 2.5em

/* this component maps over all of the user's riffs for this video */
function RiffList(props) {
  var totalLength = 0;
  const riffs = props.riffs
    ? Object.values(props.riffs).sort((e1, e2) => e1.start - e2.start)
    : [];

  var scroll = true;
  const riffDetails = [];
  for (const index in riffs) {
    const riff = riffs[index];
    const posStyles = {};
    if (riff.start > totalLength) {
      posStyles.top = `${riff.start / 10}em`;
      totalLength = riff.start + Math.max(riff.duration, size);
    } else {
      posStyles.top = `${totalLength / 10}em`;
      totalLength += Math.max(riff.duration, size);
    }
    //posStyles.height = `${Math.max(riff.duration / 10, size / 10)}em`;
    riffDetails[index] = (
      <RiffDetail
        key={riff.id}
        style={posStyles}
        {...riff}
        index={index}
        selected={props.riffsPlaying[index]}
        scroll={props.riffsPlaying[index] && scroll}
      />
    );
    if (props.riffsPlaying[index]) scroll = false;
  }

  return (
    <div className="list-of-riffs" style={{ height: `${totalLength / 10}em` }}>
      {riffDetails}
    </div>
  );
}

const mapStateToProps = (state) => ({
  riffs: state.riffs.all,
  riffsPlaying: state.riffsPlaying,
});

export default connect(mapStateToProps, null)(RiffList);
