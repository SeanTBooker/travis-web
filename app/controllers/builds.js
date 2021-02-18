import { sort, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  tabStates: service(),
  features: service(),
  externalLinks: service(),

  buildsSorting: ['number:desc'],
  builds: sort('model', 'buildsSorting'),

  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),

  showBuildHistoryLink: computed('repo.{isMigrated,isHistoryMigrated}', 'builds.length', 'features.proVersion', function () {
    const { isMigrated, isHistoryMigrated } = this.repo;
    const proVersion = this.get('features.proVersion');
    const hasBuilds = this.builds.length > 0;
    return isMigrated && !isHistoryMigrated && hasBuilds && proVersion;
  }),

  buildHistoryLink: computed('repo.slug', function () {
    return this.externalLinks.orgBuildHistoryLink(this.repo.slug);
  }),

  displayShowMoreButton: computed('tab', 'builds.lastObject.number', function () {
    let tab = this.tab;
    let lastBuildNumber = this.get('builds.lastObject.number');
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  }),

  displayShowExportFiles: computed('repo', function () {
    return true;
  }),

  loadExportFiles: task(function* () {
    yield this.store.query('build', {});
  }).drop(),

  _constructOptions(type) {
    let options = {
      repository_id: this.get('repo.id'),
      offset: this.get('builds.length'),
    };
    if (type != null) {
      options.event_type = type.replace(/s$/, '');
      if (options.event_type === 'push') {
        options.event_type = ['push', 'api', 'cron'];
      }
    }

    return options;
  },
});
