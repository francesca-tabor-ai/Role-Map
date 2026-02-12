
import { Person, ResponsibilityAssignment, Activity, OrgGap, RACIType } from '../../types';

/**
 * Rule-based organizational health detector.
 * Provides deterministic analysis of the RACI matrix and team structure.
 */
export class GapDetector {
  static detectGaps(
    people: Person[],
    assignments: ResponsibilityAssignment[],
    activities: Activity[]
  ): OrgGap[] {
    const gaps: OrgGap[] = [];

    // 1. Missing Accountable (A) Owners
    // Every activity must have exactly one person accountable.
    activities.forEach((activity) => {
      const activityAssignments = assignments.filter((a) => a.activityId === activity.id);
      const accountables = activityAssignments.filter((a) => a.raciType === RACIType.A);

      if (accountables.length === 0) {
        gaps.push({
          id: `missing-a-${activity.id}`,
          type: 'missing_raci',
          severity: 'high',
          message: `No one is Accountable for "${activity.name}"`,
          context: `Activities without an 'A' assignment often stall as there is no single owner to drive the final decision.`,
        });
      } else if (accountables.length > 1) {
        gaps.push({
          id: `multi-a-${activity.id}`,
          type: 'risk_concentration',
          severity: 'medium',
          message: `Multiple owners Accountable for "${activity.name}"`,
          context: `${accountables.length} people are marked as Accountable. Ownership should be singular to avoid conflicting decisions.`,
        });
      }
    });

    // 2. Risk Concentration (Overloaded People)
    // Identify individuals with too many primary accountabilities.
    people.forEach((person) => {
      const personAccountabilities = assignments.filter(
        (a) => a.personId === person.id && a.raciType === RACIType.A
      );

      if (personAccountabilities.length > 4) {
        gaps.push({
          id: `overload-${person.id}`,
          type: 'risk_concentration',
          severity: 'high',
          message: `Risk Concentration: ${person.name} is overloaded`,
          context: `${person.name} is Accountable for ${personAccountabilities.length} activities. This exceeds recommended limits for effective leadership.`,
        });
      }
    });

    // 3. Missing Critical Roles by Category
    // Ensure functional clusters have the specialized talent they need.
    const categoriesInPlay = new Set(activities.map((a) => a.category));
    const rolesPresent = new Set(people.map((p) => p.canonicalRole));

    if (categoriesInPlay.has('Safety & Governance')) {
      const safetyRoles = ['Responsible AI Specialist', 'Model Risk', 'Legal'];
      const hasSafetyRole = safetyRoles.some((role) => rolesPresent.has(role));
      if (!hasSafetyRole) {
        gaps.push({
          id: 'missing-safety-role',
          type: 'missing_role',
          severity: 'high',
          message: 'Missing Specialized Safety Leadership',
          context: 'You have "Safety & Governance" activities mapped but no specialized "Responsible AI" or "Model Risk" roles in the roster.',
        });
      }
    }

    if (categoriesInPlay.has('Production Ops')) {
      const opsRoles = ['DevOps / MLOps Engineer', 'AI Platform Engineer'];
      const hasOpsRole = opsRoles.some((role) => rolesPresent.has(role));
      if (!hasOpsRole) {
        gaps.push({
          id: 'missing-ops-role',
          type: 'missing_role',
          severity: 'medium',
          message: 'Potential MLOps Bottleneck',
          context: 'Production-ready AI requires specialized MLOps or Platform Engineering which is currently missing from your team.',
        });
      }
    }

    // 4. Redundancy / Single Point of Failure
    // Activities with only one 'Responsible' person and no backups/consultants.
    activities.forEach((activity) => {
      const activityAssignments = assignments.filter((a) => a.activityId === activity.id);
      const responsibles = activityAssignments.filter((a) => a.raciType === RACIType.R);

      if (responsibles.length === 1 && activityAssignments.length === 1) {
        gaps.push({
          id: `redundancy-${activity.id}`,
          type: 'redundancy',
          severity: 'low',
          message: `Siloed execution for "${activity.name}"`,
          context: `Only one person is involved in this activity. Consider adding "Consulted" or "Informed" parties to improve collaboration.`,
        });
      }
    });

    return gaps;
  }
}
