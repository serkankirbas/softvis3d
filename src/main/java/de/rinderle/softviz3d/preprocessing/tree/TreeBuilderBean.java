/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.preprocessing.tree;

import com.google.inject.Inject;
import de.rinderle.softviz3d.domain.VisualizationRequest;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.dto.SonarSnapshotDTO;
import de.rinderle.softviz3d.sonar.SonarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class TreeBuilderBean implements TreeBuilder {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeBuilderBean.class);

  @Inject
  private SonarService sonarService;

  @Override
  public TreeNode createTreeStructure(final VisualizationRequest requestDTO) {
    LOGGER.info("Created tree structure for id " + requestDTO.getRootSnapshotId());
    final PathWalker pathWalker = new PathWalker(requestDTO.getRootSnapshotId());

    final List<SonarSnapshotDTO> flatChildren =
      this.sonarService.getFlatChildrenWithMetrics(requestDTO);

    for (final SonarSnapshotDTO flatChild : flatChildren) {
      pathWalker.addPath(flatChild);
    }

    return pathWalker.getTree();
  }

}
