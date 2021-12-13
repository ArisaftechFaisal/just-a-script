import {
  Container,
  Typography,
  InputLabel,
  Input,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import LinearProgressWithLabel from "./components/LinearProgressWithLabel";

const { selectFolder, replaceInXlsx, onProgress, openContainingFolder } =
  window.electron;

function ReplaceString(): JSX.Element {
  const [folderPath, setFolderPath] = useState("");
  const [err, setErr] = useState<string>("");
  const [progress, setProgress] = useState<Progress>({
    done: 0,
    failed: 0,
    total: 0,
  });
  const [replaceItems, setReplaceItems] = useState<ReplaceItem[]>([
    { before: "", after: "", partial: false },
  ]);

  useEffect(() => {
    onProgress(setProgress);
  }, []);

  useEffect(() => {
    if (progress.failed > 0) {
      setErr(
        "Please make sure all files and sub-folders in selected folder has write permission and not opened in any other programs"
      );
    }
    if (progress.done + progress.failed !== progress.total) {
      setErr("");
    }
  }, [progress]);

  const handleSelectFolder = async () => {
    const d = await selectFolder();
    if (d.canceled) return;
    setFolderPath(d.path);
  };

  const handleExecute = () => {
    replaceInXlsx({
      folderPath,
      replaceItems,
    });
  };

  const log = () => {
    console.log(folderPath);
    console.log(replaceItems);
  };

  const modifyReplaceItems = (
    items: ReplaceItem[],
    pos = 0,
    val: ReplaceItem = { before: "", after: "", partial: false },
    taskType: "add" | "replace" | "replace" | "remove" = "add"
  ) => {
    const arr = [...items];
    switch (taskType) {
      case "add":
        arr.push(val);
        break;
      case "remove":
        arr.splice(pos, 1);
        break;
      case "replace":
        arr.splice(pos, 1, val);
        break;
      default:
        break;
    }
    return arr;
  };

  return (
    <>
      <Container>
        <Typography variant="h3" marginY={2}>
          Replace Text in XLSX
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            marginBlock: "3rem",
            // paddingRight: '3rem',
            // maxWidth: 'fit-content',
            height: "25rem",
            scrollBehavior: "smooth",
            overflowY: "auto",
          }}
        >
          <Stack spacing={4}>
            {replaceItems.map((item, i) => (
              <Stack
                direction="row"
                key={`${i}`}
                alignItems="center"
                spacing={4}
              >
                <Stack>
                  <InputLabel>Text to replace:</InputLabel>
                  <Input
                    value={item.before}
                    onChange={(e) =>
                      setReplaceItems([
                        ...modifyReplaceItems(
                          replaceItems,
                          i,
                          {
                            before: e.target.value,
                            after: item.after,
                            partial: item.partial,
                          },
                          "replace"
                        ),
                      ])
                    }
                  />
                  <InputLabel>Replacement text:</InputLabel>
                  <Input
                    value={item.after}
                    onChange={(e) =>
                      setReplaceItems([
                        ...modifyReplaceItems(
                          replaceItems,
                          i,
                          {
                            before: item.before,
                            after: e.target.value,
                            partial: item.partial,
                          },
                          "replace"
                        ),
                      ])
                    }
                  />
                </Stack>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item.partial}
                        onChange={(e) =>
                          setReplaceItems([
                            ...modifyReplaceItems(
                              replaceItems,
                              i,
                              {
                                before: item.before,
                                after: item.after,
                                partial: e.target.checked,
                              },
                              "replace"
                            ),
                          ])
                        }
                      />
                    }
                    label="Partial Match"
                  />
                </FormGroup>
                <IconButton
                  color="error"
                  onClick={() =>
                    setReplaceItems([
                      ...modifyReplaceItems(
                        replaceItems,
                        i,
                        undefined,
                        "remove"
                      ),
                    ])
                  }
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Button
          variant="outlined"
          sx={{ marginBlock: "2rem" }}
          endIcon={<AddIcon fontSize="large" />}
          onClick={() => setReplaceItems([...modifyReplaceItems(replaceItems)])}
        >
          Add Item
        </Button>
        <Typography variant="h5">Folder path:</Typography>
        <Typography variant="overline" display="block">
          {folderPath}
        </Typography>
        <Stack direction="row" spacing={4} sx={{ marginBlock: "0.5rem" }}>
          <Button variant="contained" onClick={handleSelectFolder}>
            Select Folder
          </Button>

          {/* {folderPath !== '' && <Button onClick={handleExecute}>Execute</Button>} */}
          {folderPath !== "" && (
            <>
              {progress.done + progress.failed === progress.total && (
                <Button
                  onClick={handleExecute}
                  color="success"
                  variant="contained"
                >
                  Execute
                </Button>
              )}
              {progress.done + progress.failed === progress.total || (
                <Button onClick={handleExecute} disabled>
                  <CircularProgress size="1rem" />
                </Button>
              )}
            </>
          )}
          {/* <Button onClick={log}>Log</Button> */}
          {folderPath && (
            // <Button
            //   sx={{ fontSize: "0.9rem", color: "#888" }}
            //   onClick={() => openContainingFolder(folderPath)}
            //   endIcon={<FolderOpenIcon />}
            // >
            //   Open Folder
            // </Button>
            <IconButton
              sx={{ fontSize: "0.9rem", color: "#888" }}
              onClick={() => openContainingFolder(folderPath)}
            >
              <FolderOpenIcon />
            </IconButton>
          )}
        </Stack>
        {progress.total !== 0 && (
          <LinearProgressWithLabel
            value={((progress.done + progress.failed) * 100) / progress.total}
          />
        )}
        {progress.total !== 0 &&
          progress.done + progress.failed === progress.total && (
            <Typography variant="overline">
              Succeeded: {progress.done}, Failed: {progress.failed}, Total
              files:{progress.total}
            </Typography>
          )}
      </Container>
      {/* <Box sx={{ position: 'absolute', x: '0px', y: '-90%' }}> */}
      {err && (
        <Box
          sx={{
            marginInline: "1rem",
            marginBottom: "1rem",
            paddingInline: "8px",
            position: "absolute",
            left: "0px",
            bottom: "0px",
            border: "solid 1px gray",
          }}
        >
          <Typography variant="caption" fontSize="1rem" color="error">
            Error: {err}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ReplaceString;
