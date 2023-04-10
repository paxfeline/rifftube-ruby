import React, { createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { setMetaBarPlayhead } from '../actions';

const MetaBar = ({ riffsMeta, riffs, duration, metaBarPlayhead }) =>
{
  setMetaBarPlayhead(createRef());
  return (
    <div className="container-riff-meta">
      <div id="meta-play-head" ref={metaBarPlayhead} />
      {riffsMeta &&
        duration &&
        riffs &&
        riffsMeta
          .filter((el) => !Object.values(riffs).find((t) => el.id === t.id))
          .map((riff) => (
            <div
              key={riff.id}
              className="riff-meta"
              style={{
                left: (riff.start / duration) * 100 + '%',
                width: (riff.duration / duration) * 100 + '%',
              }}
            />
          ))}
      {riffs &&
        Object.values(riffs).map((riff) => (
          <div
            key={riff.id}
            className="riff-own-meta"
            style={{
              left: (riff.start / duration) * 100 + '%',
              width: (riff.duration / duration) * 100 + '%',
            }}
          ></div>
        ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  riffsMeta: state.riffsMeta,
  riffs: state.riffs,
  duration: state.duration,
  metaBarPlayhead: state.metaBarPlayhead,
});

const mapDispatchToProps = {
  setMetaBarPlayhead,
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaBar);