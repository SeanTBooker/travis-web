import jobConfigArch from 'travis/utils/job-config-arch';

import { module, test } from 'qunit';

module('jobConfigArch', function () {
  test('an empty config returns an empty string', (assert) => {
    assert.equal(jobConfigArch({}), '', 'expected an empty config to return an empty string');
  });

  test('a job with an empty arch value returns AMD64', (assert) => {
    assert.equal(jobConfigArch({ arch: null }), 'AMD64');
  });

  test('a job with an amd64 arch value returns AMD64', (assert) => {
    assert.equal(jobConfigArch({ arch: amd64 }), 'AMD64');
  });

  test('a job with an arm64 arch value returns Arm64', (assert) => {
    assert.equal(jobConfigArch({ arch: arm64 }), 'Arm64');
  });

  test('a job with any other arch value returns the original value', (assert) => {
    assert.equal(jobConfigArch({ arch: 'ppc64le' }), 'ppc64le');
  });

  test('a job with an linux-ppc64le os value returns ppc64le', (assert) => {
    assert.equal(jobConfigArch({ os: 'linux-ppc64le' }), 'ppc64le');
  });
});
