import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetGrowthLogs, useAddGrowthLog, useDeleteGrowthLog, useUpdateGrowthLog } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { GrowthChart } from './GrowthChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Info } from 'lucide-react';
import { sanitizeHeightInput, handleHeightKeyDown } from '../../utils/heightInput';

export function GrowthLogPanel() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorInitializing } = useActor();
  const isAuthenticated = !!identity;
  const { data: logs = [] } = useGetGrowthLogs();
  const addMutation = useAddGrowthLog();
  const deleteMutation = useDeleteGrowthLog();
  const updateMutation = useUpdateGrowthLog();

  const [newHeight, setNewHeight] = useState('');
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editHeight, setEditHeight] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAdd = () => {
    const height = Math.round(parseFloat(newHeight));
    if (height > 0) {
      addMutation.mutate(height);
      setNewHeight('');
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdate = (id: bigint) => {
    const height = Math.round(parseFloat(editHeight));
    if (height > 0) {
      updateMutation.mutate({ id, newHeight: height });
      setEditingId(null);
      setEditHeight('');
    }
  };

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const handleHeightInputChange = (value: string, setter: (v: string) => void) => {
    const sanitized = sanitizeHeightInput(value, 'cm');
    setter(sanitized);
  };

  const isActionsDisabled = !isAuthenticated || actorInitializing || !actor;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Growth Journey</CardTitle>
              <CardDescription>Track your height measurements over time</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isActionsDisabled}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Height Measurement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="newHeight">Height (cm)</Label>
                    <Input
                      id="newHeight"
                      type="number"
                      step="1"
                      value={newHeight}
                      onChange={(e) => handleHeightInputChange(e.target.value, setNewHeight)}
                      onKeyDown={(e) => handleHeightKeyDown(e, 'cm')}
                      placeholder="Enter height in cm"
                    />
                  </div>
                  <Button onClick={handleAdd} disabled={addMutation.isPending} className="w-full">
                    {addMutation.isPending ? 'Adding...' : 'Add Measurement'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!isAuthenticated && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please log in to track your growth journey.
              </AlertDescription>
            </Alert>
          )}

          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No measurements recorded yet. Add your first entry to start tracking!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Height (cm)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id.toString()}>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell>
                      {editingId === log.id ? (
                        <Input
                          type="number"
                          step="1"
                          value={editHeight}
                          onChange={(e) => handleHeightInputChange(e.target.value, setEditHeight)}
                          onKeyDown={(e) => handleHeightKeyDown(e, 'cm')}
                          className="w-32"
                        />
                      ) : (
                        `${Math.round(log.heightCm)} cm`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === log.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleUpdate(log.id)} disabled={isActionsDisabled}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isActionsDisabled}
                            onClick={() => {
                              setEditingId(log.id);
                              setEditHeight(Math.round(log.heightCm).toString());
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isActionsDisabled}
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Growth Visualization</CardTitle>
            <CardDescription>Your height progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart logs={logs} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
